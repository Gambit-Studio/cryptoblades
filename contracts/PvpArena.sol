pragma solidity ^0.6.0;
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "./cryptoblades.sol";
import "./characters.sol";
import "./weapons.sol";
import "./shields.sol";
import "./raid1.sol";

contract PvpArena is Initializable, AccessControlUpgradeable {
    using SafeMath for uint256;
    using SafeMath for uint8;

    bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");

    struct Fighter {
        uint256 characterID;
        uint256 weaponID;
        uint256 shieldID;
        /// @dev amount of skill wagered for this character
        uint256 wagerAmount;
        bool useShield;
    }

    struct CharacterStatistcs {
        uint256 characterID;
        uint256 totalGamesPlayed;
        uint256 totalGamesLost;
        uint256 totalGamesWon;
        uint256 totalPoints;
    }

    struct TopThreeRankingDetails {
        uint256 characterID;
        uint256 totalPoints;
        uint256 rank;
        uint256 lastUpdatedAt;
    }

    CryptoBlades public game;
    Characters public characters;
    Weapons public weapons;
    Shields public shields;
    IERC20 public skillToken;
    Raid1 public raids;

   
    /// @dev how many times the cost of battling must be wagered to enter the arena
    uint256 wageringFactor;

    ///@dev Total number of games played in the arena
    uint256 totalGamesPlayed;

    /// @dev Total number of points of rank one
    uint256 public pointsOfRankOne;

    /// @dev Total number of points of rank two
    uint256 public pointsOfRankTwo;

    /// @dev Total number of points of rank three
    uint256 public pointsOfRankThree;

    
    TopThreeRankingDetails[3] public topThreeRankers;

    /// @dev Fighter by characterID
    mapping(uint256 => Fighter) public fightersByCharacterID;

    /// @dev IDs of characters available by tier (1-10, 11-20, etc...)
    mapping(uint8 => uint256[]) private fightersByTier;
    /// @dev IDs of characters in the arena per player
    mapping(address => uint256[]) private fightersByPlayer;

    ///@dev characters currently in the arena
    mapping(uint256 => bool) public charactersInUse;

    ///@dev weapons currently in the arena
    mapping(uint256 => bool) public weaponsInUse;

    ///@dev shields currently in the arena
    mapping(uint256 => bool) public shieldsInUse;

    ///@dev current top 3 characters
    mapping(uint256 => TopThreeRankingDetails) public topThreeRankingDetailsByRank;

    ///@dev character's overall stats including ranking
    mapping(uint256 => CharacterStatistcs) public characterStatisticsByID;

    

    modifier enteringArenaChecks(
        uint256 characterID,
        uint256 weaponID,
        uint256 shieldID,
        bool useShield
    ) {
        
        require(
            !charactersInUse[characterID],
            "The character is already in the arena"
        );
        require(!weaponsInUse[weaponID], "The weapon is already in the arena");
        require(
            characters.ownerOf(characterID) == msg.sender,
            "You don't own the given character"
        );
        require(
            weapons.ownerOf(weaponID) == msg.sender,
            "You don't own the given weapon"
        );
        require(
            !raids.isCharacterRaiding(characterID),
            "The given character is already raiding"
        );
        require(
            !raids.isWeaponRaiding(weaponID),
            "The given weapon is already raiding"
        );

        if (useShield) {
            require(
                shields.ownerOf(shieldID) == msg.sender,
                "You don't own the given shield"
            );
            require(
                !shieldsInUse[shieldID],
                "The shield is already in the arena"
            );
            // TODO: Check if shields are used in the arena somehow
        }

        _;
    }

    modifier beforePerformingDuel(uint256 characterID){
         require(
            charactersInUse[characterID],
            "The character is not in the arena"
        );
        require(
            characters.ownerOf(characterID) == msg.sender,
            "You don't own the given character"
        );
        _;
    }

    function initialize(
        address gameContract,
        address shieldsContract,
        address raidContract
    ) public initializer {
        __AccessControl_init_unchained();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        game = CryptoBlades(gameContract);
        characters = Characters(game.characters());
        weapons = Weapons(game.weapons());
        shields = Shields(shieldsContract);
        skillToken = IERC20(game.skillToken());
        raids = Raid1(raidContract);

        wageringFactor = 3;
    }

    /// @notice enter the arena with a character, a weapon and optionally a shield
    function enterArena(
        uint256 characterID,
        uint256 weaponID,
        uint256 shieldID,
        bool useShield
    ) public enteringArenaChecks(characterID, weaponID, shieldID, useShield) {
        uint256 wager = getEntryWager(characterID);
        uint8 tier = getArenaTier(characterID);

        charactersInUse[characterID] = true;
        weaponsInUse[weaponID] = true;

        if (useShield) shieldsInUse[shieldID] = true;

        fightersByTier[tier].push(characterID);
        fightersByPlayer[msg.sender].push(characterID);
        fightersByCharacterID[characterID] = Fighter(
            characterID,
            weaponID,
            shieldID,
            wager,
            useShield
        );

        skillToken.transferFrom(msg.sender, address(this), wager);
    }

    /// @notice gets the amount of SKILL that is risked per duel
    function getDuelCost(uint256 characterID) public view returns (uint256) {
        // FIXME: Use normal combat rewards formula. THIS IS JUST TEMPORARY CODE
        return getArenaTier(characterID).add(1).mul(1000);
    }

    /// @notice gets the amount of SKILL required to enter the arena
    /// @param characterID the id of the character entering the arena
    function getEntryWager(uint256 characterID) public view returns (uint256) {
        return getDuelCost(characterID).mul(wageringFactor);
    }

    /// @dev gets the arena tier of a character (tiers are 1-10, 11-20, etc...)
    function getArenaTier(uint256 characterID) public view returns (uint8) {
        uint256 level = characters.getLevel(characterID);

        return uint8(level.div(10));
    }

    /// @dev gets IDs of the sender's characters currently in the arena
    function getMyParticipatingCharacters()
        public
        view
        returns (uint256[] memory)
    {
        return fightersByPlayer[msg.sender];
    }

    /// @dev attempts to find an opponent for a character. If a battle is still pending, it charges a penalty and re-rolls the opponent
    function requestOpponent(uint256 characterID) public returns (uint256) {
        // TODO: implement (not final signature)
    }

    /// @dev checks if a character is in the arena
    function isCharacterInArena(uint256 characterID)
        public
        view
        returns (bool)
    {
        return charactersInUse[characterID];
    }

    /// @dev checks if a weapon is in the arena
    function isWeaponInArena(uint256 weaponID) public view returns (bool) {
        return weaponsInUse[weaponID];
    }

    /// @dev checks if a shield is in the arena
    function isShieldInArena(uint256 shieldID) public view returns (bool) {
        return shieldsInUse[shieldID];
    }

    /// @dev performs a given character's duel against its opponent
    function performDuel(uint256 characterID,uint256 winner) public beforePerformingDuel(characterID) {
        // TODO: implement (not final signature)
        
        uint8 tier = getArenaTier(characterID);
        uint256 opponentCharacterID = fightersByTier[tier][1];
        caluculateTopThreeRanking(characterID,opponentCharacterID,winner);
    }

    /// @dev caluclates ranking to determine opponentCharacter rankers
    function caluculateTopThreeRanking(uint256 characterID,uint256 opponentCharacterID,uint256 winner) private{
        CharacterStatistcs storage opponentCharacter = characterStatisticsByID[opponentCharacterID];
        CharacterStatistcs storage myCharacter = characterStatisticsByID[characterID];
        if (winner == 1) {
            opponentCharacter.totalPoints += 1;
            opponentCharacter.totalGamesPlayed += 1;
            opponentCharacter.totalGamesWon += 1;
            myCharacter.totalGamesPlayed += 1;
            myCharacter.totalGamesLost += 1;
            if (pointsOfRankOne < opponentCharacter.totalPoints) {
                
                opponentCharacter.characterID= opponentCharacterID;
                pointsOfRankOne = opponentCharacter.totalPoints;
                topThreeRankers[0] = TopThreeRankingDetails(
                    opponentCharacterID,
                    opponentCharacter.totalPoints,
                    1,
                    block.timestamp
                );
            } else if (pointsOfRankTwo < opponentCharacter.totalPoints) {
               
                opponentCharacter.characterID= opponentCharacterID;
                pointsOfRankTwo = opponentCharacter.totalPoints;
              topThreeRankers[1] = TopThreeRankingDetails(
                    opponentCharacterID,
                    opponentCharacter.totalPoints,
                    2,
                    block.timestamp
                );
            } else if (pointsOfRankThree < opponentCharacter.totalPoints) {
                
                opponentCharacter.characterID= opponentCharacterID;
                pointsOfRankThree = opponentCharacter.totalPoints;
               topThreeRankers[2] = TopThreeRankingDetails(
                    opponentCharacterID,
                    opponentCharacter.totalPoints,
                    3,
                    block.timestamp
                );
            }
        } else {
            myCharacter.totalPoints += 1;
            myCharacter.totalGamesPlayed += 1;
            myCharacter.totalGamesWon += 1;
            opponentCharacter.totalGamesPlayed += 1;
            opponentCharacter.totalGamesLost += 1;
            if (pointsOfRankOne < myCharacter.totalPoints) {
               
                myCharacter.characterID= characterID;
                pointsOfRankOne = myCharacter.totalPoints;
                topThreeRankers[0] = TopThreeRankingDetails(
                    characterID,
                    myCharacter.totalPoints,
                    1,
                    block.timestamp
                );
            } else if (pointsOfRankTwo < myCharacter.totalPoints) {
               
                myCharacter.characterID= characterID;
                pointsOfRankTwo = myCharacter.totalPoints;
                topThreeRankers[1] = TopThreeRankingDetails(
                    characterID,
                    myCharacter.totalPoints,
                    2,
                    block.timestamp
                );
            } else if (pointsOfRankThree < myCharacter.totalPoints) {
               
                myCharacter.characterID= characterID;
                pointsOfRankThree = myCharacter.totalPoints;
                topThreeRankers[2] = TopThreeRankingDetails(
                    characterID,
                    myCharacter.totalPoints,
                    3,
                    block.timestamp
                );
            }
        }
        totalGamesPlayed++;
    }

    /// @dev withdraws a character from the arena.
    /// if the character is in a battle, a penalty is charged
    function withdrawCharacter(uint256 characterID) public {
        // TODO: implement (not final signature)
    }
}

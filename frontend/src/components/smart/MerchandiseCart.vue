<template>
  <div class="d-flex m-3 cart-container">
    <div class="d-flex justify-content-between align-items-center">
      <strong>{{ $t('market.merchandise.showFiatPrices') }}</strong>
      <b-form-checkbox class="m-2" size="sm" :checked="showFiatPrices" @change="toggleShowFiatPrices()" switch></b-form-checkbox>
    </div>
    <b-button variant="primary" class="shop-button" @click="openCartModal">
      <i class="fas fa-shopping-cart p-1"></i>{{ $t('market.merchandise.cart') }} ({{ cartEntries.length }})
    </b-button>

    <b-modal class="centered-modal" v-model="showModal" button-size="lg" size="xl" scrollable
             :title="$t('market.merchandise.yourCart')">
      <div v-if="cartEntries.length === 0" class="d-flex justify-content-center">
        <h3>{{ $t('market.merchandise.nothingInCart') }}</h3>
      </div>
      <div v-else class="cart-entries-container">
        <div class="cart-entry-container" v-for="cartEntry in cartEntries" :key="cartEntry.variant.external_id">
          <img class="variant-image flex-grow-1 m-2"
               :src="cartEntry.variant.files.find(file => isFileTypePreview(file)).preview_url"
               alt="">
          <div class="d-flex flex-column justify-content-center align-items-center flex-grow-1 w-50">
            <p>{{ cartEntry.variant.name }}</p>
            <div class="d-inline"><span>{{ $t('market.merchandise.price') }}: </span><span
              v-if="showFiatPrices">{{ cartEntry.variant.retail_price }} {{
                cartEntry.variant.currency
              }} / </span>
              <span><CurrencyConverter v-if="cartEntry.variant && cartEntry.variant.retail_price"
                                       :skill="fromWeiEther(toBN(usdToSkill(cartEntry)))"
                                       :show-value-in-skill-only="true"/></span></div>
          </div>
          <div class="quantity-display flex-grow-1 m-2">
            <div class="input-group-prepend">
              <b-button class="btn-primary" type="button" :disabled="isMinusButtonDisabled(cartEntry)"
                        @click="subtractQuantity(cartEntry)"><i class="fas fa-minus"></i></b-button>
            </div>
            <b-input type="number" readonly class="form-control" :value="cartEntry.quantity" min="1"></b-input>
            <div class="input-group-append">
              <b-button class="btn-primary" type="button" @click="addQuantity(cartEntry)"><i class="fas fa-plus"></i>
              </b-button>
            </div>
            <b-button class="btn-danger" type="button" @click="deleteCartEntry(cartEntry)"><i class="fas fa-trash"></i>
            </b-button>
          </div>
        </div>
      </div>
      <template #modal-footer>
        <div class="cart-footer">
          <div>
            <span class="p-2"></span>
          </div>
          <div class="d-flex align-items-center">
            <div v-if="cartEntries.length !== 0" class="d-flex flex-column p-3">
              <span class="font-weight-bold">{{ $t('market.merchandise.total') }}: </span>
              <div><span v-if="showFiatPrices">{{ totalPrice.toFixed(2) }} {{
                  cartEntries[0].variant.currency
                }} / </span>
                <CurrencyConverter :skill="fromWeiEther(totalPriceInSkill)" :show-value-in-skill-only="true"/>
                <span class="text-uppercase"> + {{ $t('market.merchandise.shipping') }} </span>
                <i v-b-tooltip="$t('market.merchandise.shippingCostAfterNextStep')" class="far fa-question-circle"/>
              </div>
            </div>
            <b-button
              :disabled="isContinueToCheckoutButtonDisabled()"
              variant="primary" size="lg"
              @click="openAddressModal">
              {{ $t('market.merchandise.continue') }}
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {PropType} from 'vue/types/options';
import {CartEntry, FileType} from '@/components/smart/VariantChoiceModal.vue';
import {mapActions, mapMutations, mapState} from 'vuex';
import {fromWeiEther, toBN} from '@/utils/common';
import CurrencyConverter from '@/components/CurrencyConverter.vue';

interface StoreMappedMutations {
  removeCartEntry(cartEntry: CartEntry): void;
}

interface StoreMappedActions {
  currentSkillPrice(): Promise<string>;
}

interface Data {
  totalPrice: number;
  totalPriceInSkill: number;
  skillPrice: number;
  showModal: boolean;
}

export default Vue.extend({
  data() {
    return {
      totalPrice: 0,
      totalPriceInSkill: 0,
      skillPrice: 0,
      showModal: false,
    } as Data;
  },

  props: {
    cartEntries: {
      type: Array as PropType<CartEntry[]>,
      required: true
    },
    showFiatPrices: {
      type: Boolean,
    }
  },

  components: {CurrencyConverter},

  computed: {
    ...mapState(['skillBalance']),
  },

  methods: {
    ...mapActions(['currentSkillPrice']) as StoreMappedActions,
    ...mapMutations(['removeCartEntry']) as StoreMappedMutations,
    fromWeiEther,
    toBN,
    async openAddressModal() {
      this.$root.$emit('merchandise-address-modal', this.totalPriceInSkill, this.cartEntries);
    },
    async openCartModal() {
      this.skillPrice = +await this.currentSkillPrice();
      this.calculateTotalPrice();
      this.showModal = true;
    },
    isFileTypePreview(file: File) {
      return file.type === FileType.PREVIEW;
    },
    subtractQuantity(cartEntry: CartEntry) {
      cartEntry.quantity--;
      this.calculateTotalPrice();
    },
    addQuantity(cartEntry: CartEntry) {
      cartEntry.quantity++;
      this.calculateTotalPrice();
    },
    calculateTotalPrice() {
      this.totalPrice = this.cartEntries.map(cartEntry => +cartEntry.variant.retail_price * cartEntry.quantity)
        .reduce((a, b) => a + b, 0);
      this.totalPriceInSkill = this.totalPrice * this.skillPrice;
    },
    usdToSkill(cartEntry: CartEntry) {
      if (!cartEntry?.variant) return;
      return +cartEntry.variant.retail_price * this.skillPrice;
    },
    deleteCartEntry(cartEntry: CartEntry) {
      this.removeCartEntry(cartEntry);
      this.calculateTotalPrice();
    },
    isMinusButtonDisabled(cartEntry: CartEntry) {
      return cartEntry.quantity <= 1;
    },
    isContinueToCheckoutButtonDisabled() {
      return this.cartEntries.length === 0;
    },
    toggleShowFiatPrices() {
      this.$root.$emit('toggle-fiat-prices');
    },
    canAffordMerch() {
      const cost = toBN(this.totalPriceInSkill);
      const balance = toBN(this.skillBalance);
      return balance.isGreaterThanOrEqualTo(cost);
    },
  },

  async mounted() {
    this.$root.$on('merchandise-cart-modal', async (open: boolean) => {
      this.skillPrice = +await this.currentSkillPrice();
      this.calculateTotalPrice();
      this.showModal = open;
    });
  },
});
</script>

<style>
.variant-image {
  max-width: 200px;
}

.cart-entry-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #6c5f38;
  border-top: 1px solid #6c5f38;
}

.cart-entries-container {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.hidden {
  visibility: hidden;
}

.cart-container {
  justify-content: space-between;
}

.cart-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: space-between;
}

@media (max-width: 576px) {
  .cart-entry-container {
    flex-direction: column;
    gap: 0.5em;
  }

  .cart-footer {
    flex-direction: column;
    width: 100%;
  }

  .cart-container {
    justify-content: center;
  }
}
</style>

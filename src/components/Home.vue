<template>
  <div id="home">

    <el-row :gutter="20">
      <el-col :xs="24" :sm="8" :md="6">
        <el-card class="box-card menu">
          <h2 style="margin-top: 0">
              <span>Filters</span>
              <el-button class="hidden-sm-and-up" v-if="showFilters" style="float:right;" size="medium" round @click="showFilters = false">Hide</el-button>
              <el-button class="hidden-sm-and-up" v-else style="float:right;" size="medium" round @click="showFilters = true">Show</el-button>
          </h2>

          <el-input
            placeholder="Search by ID"
            v-model="search"
            @input="handleFilterChange"
          >
            <i slot="prefix" class="el-input__icon fas fa-search"></i>
          </el-input>
          <el-select v-model="sort" @change="handleFilterChange" style="display: block; margin-top: 14px;">
            <el-option
              v-for="opt in sortOpts"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value">
            </el-option>
          </el-select>

          <el-collapse v-show="showFilters" v-model="activeFilters" style="margin-top: 14px;">
            <el-collapse-item title="For Sale" name="For Sale">
              <el-checkbox-group v-model="tokenFilters['For Sale']" @change="handleFilterChange">
                <el-checkbox label="Fixed Price" style="display:block;">
                  Fixed Price
                  <el-tag type="info" size="mini" effect="dark" style="float:right; border-radius: 12px;">{{ activeAsks.length }}</el-tag>
                </el-checkbox>
                <el-checkbox label="Highest Bid Auction" style="display:block;">
                  Highest Bid Auction
                  <el-tag type="info" size="mini" effect="dark" style="float:right; border-radius: 12px;">{{ activeEnglishAuctions.length }}</el-tag>
                </el-checkbox>
                <el-checkbox label="Price Drop Auction" style="display:block;">
                  Price Drop Auction
                  <el-tag type="info" size="mini" effect="dark" style="float:right; border-radius: 12px;">{{ activeDutchAuctions.length }}</el-tag>
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>

            <el-collapse-item :title="traitCategory" :name="traitCategory" v-for="(values, traitCategory) in traits" :key="traitCategory">
              <el-checkbox-group v-model="tokenFilters[traitCategory]" @change="handleFilterChange">
                <el-checkbox v-for="(traitCount, trait) in values" :key="`${traitCategory}-${trait}`" :label="trait" style="display:block;">
                  {{ trait }}
                  <el-tag size="mini" effect="dark" style="float:right; border-radius: 12px;">{{ (traitCount / totalTokens * 100).toFixed(2) }}%</el-tag>
                  <el-tag type="info" size="mini" effect="dark" style="float:right; border-radius: 12px; margin-right: 5px;">{{ traitCount }}</el-tag>
                </el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="16" :md="18" class="main">
        <div v-if="displayedTokens.length === 0">
          <el-empty description="No tokens found" :image-size="325" :image="require(`@/assets/error.png`)"></el-empty>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="token in displayedTokens" :key="token.id" style="position: relative; margin-bottom: 20px;">
            <el-card shadow="hover" :body-style="{ position: 'relative', padding: '0px' }">
              <router-link :to="{ name: 'token', params: { id: token.id } }"><img :src="transformUri(token.displayUri)" style="width: 100%; display: block;" /></router-link>
              <div style="padding: 14px;">
                <el-link :href="`https://objkt.com/asset/${objktCollection}/${token.id}`" target="_blank">#{{ token.id }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                <span style="float: right; font-size: 14px; margin-top: 3px;">Rank #{{ token.rank }}</span>
              </div>

              <div v-if="token.isFixedPrice">
                <div style="border-top: 1px solid #454545; padding: 14px; font-family: Roboto, sans-serif; font-size: 12px; height: 20px;">
                  <span><strong>Price:</strong> {{ vueNumberFormat(token.price / 1e6) }} ꜩ</span>
                </div>
              </div>
              <div v-else-if="token.isEnglishAuction">
                <div style="border-top: 1px solid #454545; padding: 14px; font-family: Roboto, sans-serif; font-size: 12px; height: 20px;">
                  <span v-if="token.auction.bids.length && token.auction.bids[0].amount > 0"><strong>High Bid:</strong> {{ vueNumberFormat(token.auction.bids[0].amount / 1e6) }} ꜩ</span>
                  <span v-else style="color: #909399;"><strong>Reserve:</strong> {{ vueNumberFormat(token.auction.reserve / 1e6) }} ꜩ</span>
                  <span style="float: right;">
                    <el-link :href="`https://objkt.com/auction/e/${token.auction.hash}`" target="_blank" style="font-size: 12px;">view<i class="far fa-external-link fa-icon-right"></i></el-link>
                  </span>
                </div>
              </div>
              <div v-else-if="token.isDutchAuction">
                <div style="border-top: 1px solid #454545; padding: 14px; font-family: Roboto, sans-serif; font-size: 12px; height: 20px;">
                  <span><strong>Price:</strong> {{ vueNumberFormat(token.price / 1e6) }} ꜩ</span>
                  <span style="float: right;">
                    <el-link :href="`https://objkt.com/auction/d/${token.auction.hash}`" target="_blank" style="font-size: 12px;">view<i class="far fa-external-link fa-icon-right"></i></el-link>
                  </span>
                </div>
              </div>
              <div v-else>
                <div style="border-top: 1px solid #454545; padding: 14px; font-family: Roboto, sans-serif; font-size: 12px; text-align: center; height: 20px; color: #C0C4CC">
                  <span>Not for sale</span>
                </div>
              </div>

              <el-popover
                placement="left-start"
                title=""
                width="325"
                trigger="hover">
                <div ref="content">
                  <el-descriptions title="Traits" :column="1" size="small" border>
                    <el-descriptions-item v-for="attribute in token.attributes" :key="`${token.id}-${attribute.name}`" :label="attribute.name">
                      {{ attribute.value }}
                      <el-tag size="mini" effect="dark" style="float:right; border-radius: 12px;">{{ (traits[attribute.name][attribute.value] / totalTokens * 100).toFixed(2) }}%</el-tag>
                      <el-tag type="info" size="mini" effect="dark" style="float:right; border-radius: 12px; margin-right: 5px;">{{ traits[attribute.name][attribute.value] }}</el-tag>
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
                <i slot="reference" class="fas fa-info-circle" style="color: #fff; position: absolute; top: 8px; left: 8px;"></i>
              </el-popover>
            </el-card>

            <el-badge v-if="token.isFixedPrice" value="Fixed Price" type="success" style="position: absolute; top: -6px; right: 14px;"></el-badge>
            <el-badge v-if="token.isEnglishAuction" value="Highest Bid Auction" type="primary" style="position: absolute; top: -6px; right: 14px;"></el-badge>
            <el-badge v-if="token.isDutchAuction" value="Price Drop Auction" type="danger" style="position: absolute; top: -6px; right: 14px;"></el-badge>

          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash';
import tokenTraits from '../assets/traits.json';
import ipfs from '../utils/ipfs';
import objkt from '../utils/objkt';

export default {
  name: 'Home',
  components: {
  },
  data: function() {
    return {
      traits: {},
      showFilters: true,
      search: "",
      sort: "rank asc",
      sortOpts: [
        { value: 'rank asc', label: 'Sort by Rank (asc)' },
        { value: 'rank desc', label: 'Sort by  Rank (desc)' },
        { value: 'price asc', label: 'Sort by Price (asc)' },
        { value: 'price desc', label: 'Sort by Price (desc)' },
      ],
      tokenFilters: {},
      activeFilters: [],
      displayedTokens: {},
      activeAsks: [],
      activeEnglishAuctions: [],
      activeDutchAuctions: [],
      objktCollection: process.env.VUE_APP_OBJKT_COLLECTION
    };
  },
  computed: {
    orderedTokens: function () {
      const sort = this.sort.split(" ");
      if (sort[0] === 'price') {
        return _.orderBy(tokenTraits, ['isForSale', sort[0]], ['desc', sort[1]]);
      }
      return _.orderBy(tokenTraits, sort[0], sort[1]);
    },
    totalTokens: function() {
      return Object.keys(tokenTraits).length;
    }
  },
  created() {
    this.displayedTokens = Object.values(this.orderedTokens).slice(0, 60);

    let numAttributes = {};

    for (const attributes of Object.values(tokenTraits)) {
      for (const attribute of attributes.attributes) {
        if (!Object.prototype.hasOwnProperty.call(this.traits, attribute.name)) {
          this.traits[attribute.name] = {};
          Vue.set(this.tokenFilters, attribute.name, []);
        }
        if (!Object.prototype.hasOwnProperty.call(this.traits[attribute.name], attribute.value)) {
          this.traits[attribute.name][attribute.value] = 0;
        }
        this.traits[attribute.name][attribute.value]++;
      }

      if (!Object.prototype.hasOwnProperty.call(numAttributes, attributes.attributes.length)) {
        numAttributes[attributes.attributes.length] = 0;
      }
      numAttributes[attributes.attributes.length]++;
    }

    this.traits['# Traits'] = numAttributes;
    Vue.set(this.tokenFilters, '# Traits', []);

    Vue.set(this.tokenFilters, 'For Sale', []);


    // Add in missing attribute counts
    for (const [ key, attribute ] of Object.entries(this.traits)) {
      this.traits[key] = Object.fromEntries(Object.entries(this.traits[key]).sort());
      const totalCount = Object.values(attribute).reduce((a, b) => a + b, 0);
      if (totalCount < this.totalTokens) {
        this.traits[key]['<None>'] = this.totalTokens - totalCount;
      }
    }

    if (this.$route.query.f || this.$route.query.s) {
      if (this.$route.query.f) {
        const queryFilters = JSON.parse(atob(this.$route.query.f));
        for (const [category, values] of Object.entries(queryFilters)) {
          this.tokenFilters[category] = values;
          this.activeFilters.push(category);
        }
      }

      if (this.$route.query.s) {
        this.sort = atob(this.$route.query.s);
      }

      this.filterTokens();
    }
  },
  async mounted() {
    const vm = this;
    (function update() {
      objkt.getActiveSales()
        .then(res => {
          vm.activeAsks = res.asks;
          vm.activeEnglishAuctions = res.english_auctions;
          vm.activeDutchAuctions = res.dutch_auctions;

          for (const id in tokenTraits) {
            tokenTraits[id].price = undefined;
            tokenTraits[id].auction = undefined;
            tokenTraits[id].isForSale = false;
            tokenTraits[id].isFixedPrice = false;
            tokenTraits[id].isEnglishAuction = false;
            tokenTraits[id].isDutchAuction = false;
          
            const ask = vm.getFixedPrice(id);
            if (ask) {
              tokenTraits[id].price = ask.price;
              tokenTraits[id].isForSale = true;
              tokenTraits[id].isFixedPrice = true;
            } else {
              const auction = vm.getEnglishAuction(id);
              if (auction) {
                tokenTraits[id].isForSale = true;
                tokenTraits[id].isEnglishAuction = true;
                tokenTraits[id].auction = auction;
                if (auction.bids.length && auction.bids[0].amount > 0) {
                  tokenTraits[id].price = auction.bids[0].amount;
                } else {
                  tokenTraits[id].price = auction.reserve;
                }
              } else {
                const dutch = vm.getDutchAuction(id);
                if (dutch) {
                  tokenTraits[id].isForSale = true;
                  tokenTraits[id].isDutchAuction = true;
                  tokenTraits[id].auction = dutch;
                  tokenTraits[id].price = Math.floor(dutch.start_price -
                    (((new Date() - new Date(dutch.start_time)) - 30000) *
                      ((dutch.start_price - dutch.end_price) / (new Date(dutch.end_time) - new Date(dutch.start_time)))
                    )
                  );
                }
              }
            }
          }
          vm.filterTokens();
        });
        setTimeout(update, 30000);
    })();
  },
  methods: {
    transformUri(uri) {
      return ipfs.transformUri(uri);
    },
    getFixedPrice: function (id) {
      return this.activeAsks.find(el => el.token.token_id == id)
    },
    getEnglishAuction: function (id) {
      return this.activeEnglishAuctions.find(el => el.token.token_id == id)
    },
    getDutchAuction: function (id) {
      return this.activeDutchAuctions.find(el => el.token.token_id == id)
    },
    handleFilterChange() {
      let queryFilters = {};
      for (const [category, values] of Object.entries(this.tokenFilters)) {
        if (values.length) {
          queryFilters[category] = values;
        }
      }

      try {
        this.$router.replace({
          query: {
              f: btoa(JSON.stringify(queryFilters)),
              s: this.sort === 'rank asc' ? undefined : btoa(this.sort)
          }
        });
      } catch (e) {
        console.log(e);
      }

      this.filterTokens();
    },
    filterTokens() {
      let filtered = false;
      let tokens = this.orderedTokens;
      const vm = this;

      if (this.search) {
        filtered = true;
        tokens = tokens.filter((token) => token.id == parseInt(vm.search));
      }

      for (const [category, values] of Object.entries(this.tokenFilters)) {
        if (values.length) {
          filtered = true;
          tokens = tokens.filter((token) => {
            if (category === '# Traits') {
              return values.includes(token.attributes.length.toString());
            }

            if (category === 'For Sale') {
              if (values.includes('Fixed Price')) {
                if (token.isFixedPrice) {
                  return true;
                }
              }
              if (values.includes('Highest Bid Auction')) {
                if (token.isEnglishAuction) {
                  return true;
                }
              }
              if (values.includes('Price Drop Auction')) {
                if (token.isDutchAuction) {
                  return true;
                }
              }
              return false;
            }

            let hasCat = false;
            let catValue = undefined;

            for (const attribute of token.attributes) {
              if (attribute.name === category) {
                hasCat = true;
                catValue = attribute.value;
              }
            }

            if (values.includes('<None>') && !hasCat) {
              catValue = '<None>';
            }

            return values.includes(catValue);
          });
        }
      }

      this.displayedTokens = filtered ? Object.values(tokens) : Object.values(this.orderedTokens).slice(0, 100);
    }
  }
}
</script>

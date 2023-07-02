<template>
  <div id="token">

    <el-row :gutter="20" align="middle">
      <el-col :xs="24" :sm="12">
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/' }">home</el-breadcrumb-item>
          <el-breadcrumb-item>token #{{ token.id }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :xs="24" :sm="12" style="text-align: right;">
        <el-button v-if="showBack" size="mini" type="primary" round style="margin-top: -6px;" @click="$router.go(-1)"><i class="far fa-undo"></i> Back</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="10">
        <el-card :body-style="{ padding: '0px' }">
            <img :src="transformUri(token.displayUri)" style="width: 100%; display: block;" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="14" class="main">
        <el-descriptions title="" :column="1">
          <el-descriptions-item label="OBJKT #">
            {{ token.id }}
            <el-link style="margin-left: auto;" :href="`https://objkt.com/asset/${objktCollection}/${token.id}`" target="_blank">View on objkt.com <i class="far fa-external-link fa-icon-right"></i></el-link>
          </el-descriptions-item>
          <el-descriptions-item label="Rarity Score">
            {{ token.score }}
          </el-descriptions-item>
          <el-descriptions-item label="Rank">
            #{{ token.rank }}
          </el-descriptions-item>
          <el-descriptions-item v-for="attribute in token.attributes" :key="`${token.id}-${attribute.name}`" :label="attribute.name">
            {{ attribute.value }}
            <el-tag type="info" size="mini" effect="dark" style="margin-left:auto; border-radius: 12px; margin-right: 5px;">{{ traits[attribute.name][attribute.value] }}</el-tag>
            <el-tag size="mini" effect="dark" style="border-radius: 12px;">{{ (traits[attribute.name][attribute.value] / totalTokens * 100).toFixed(2) }}%</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>

    <div v-if="Object.values(similarTokens).length" class="similar-tokens">
      <el-divider></el-divider>
      <h2>Similar Tokens</h2>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="token in similarTokens" :key="token.id" style="margin-bottom: 10px;">
          <el-popover
            placement="left-start"
            title=""
            width="325"
            trigger="hover"
          >
            <div ref="content">
              <el-descriptions title="Traits" :column="1" size="small" border>
                <el-descriptions-item v-for="attribute in token.attributes" :key="`${token.id}-${attribute.name}`" :label="attribute.name">
                  {{ attribute.value }}
                  <el-tag size="mini" effect="dark" style="float:right; border-radius: 12px;">{{ (traits[attribute.name][attribute.value] / totalTokens * 100).toFixed(2) }}%</el-tag>
                  <el-tag type="info" size="mini" effect="dark" style="float:right; border-radius: 12px; margin-right: 5px;">{{ traits[attribute.name][attribute.value] }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <el-card slot="reference" shadow="hover" :body-style="{ padding: '0px' }">
              <router-link :to="{ name: 'token', params: { id: token.id } }"><img :src="transformUri(token.displayUri)" style="width: 100%; display: block;" /></router-link>
              <div style="padding: 14px;">
                <el-link :href="`https://objkt.com/asset/${objktCollection}/${token.id}`" target="_blank">#{{ token.id }} <i class="far fa-external-link fa-icon-right"></i></el-link>
                <span style="float: right; font-size: 14px; margin-top: 3px;">Rank #{{ token.rank }}</span>
              </div>
            </el-card>
          </el-popover>
        </el-col>
      </el-row>
    </div>

    <div v-if="metaTraits.length" class="trait-combos">
      <el-divider></el-divider>
      <h2>Rare 2-Trait Combos</h2>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="8" v-for="trait in metaTraits" :key="`${token.id}-${trait.id}`" style="margin-bottom: 10px;">
            <el-card shadow="hover">
        <el-descriptions title="" :column="1">
          <el-descriptions-item v-for="attribute in trait.combo" :key="`${token.id}-${trait.id}-${attribute.name}`" :label="attribute.name">
            {{ attribute.value }}
          </el-descriptions-item>
        </el-descriptions>
      <el-divider style="margin-top: 0; margin-bottom: 12px;"></el-divider>
      <el-row :gutter="10" type="flex" justify="space-between" align="middle">
        <el-col :span="8">
          <el-tag type="info" size="mini" effect="dark" style="border-radius: 12px;">{{ trait.num }}</el-tag>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-tag size="mini" effect="dark" style="border-radius: 12px;">{{ (trait.num / totalTokens * 100).toFixed(2) }}%</el-tag>
        </el-col>
      </el-row>
            </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import { Combination } from 'js-combinatorics';
import _ from 'lodash';
import tokenTraits from '../assets/traits.json';
import ipfs from '../utils/ipfs';

export default {
  name: 'Token',
  components: {
  },
  data: function() {
    return {
      showBack: window.history.length > 0,
      token: {},
      similarTokens: {},
      traits: {},
      metaTraits: [],
      objktCollection: process.env.VUE_APP_OBJKT_COLLECTION
    };
  },
  computed: {
    totalTokens: function() {
      return Object.keys(tokenTraits).length;
    }
  },
  created() {
    const vm = this;
    this.token = tokenTraits[vm.$route.params.id];

    let similarTokens = {};
    if (Object.values(this.token.attributes).length > 4) {
      const combos = new Combination(this.token.attributes, parseInt(Object.values(this.token.attributes).length * 0.7));
      for (const combo of combos) {
        let allTokens = Object.values(tokenTraits);
        allTokens = allTokens.filter((f) => f.id != vm.token.id);
        for (const trait of Object.values(combo)) {
          allTokens = allTokens.filter((token) => {
            let val = undefined;
            for (const attribute of token.attributes) {
              if (attribute.name === trait.name) {
                val = attribute.value;
              }
           }
           return trait.value === val;
          });
        }

        for (const f of allTokens) {
          similarTokens[f.id] = f;
        }
      }

      this.similarTokens = _.sortBy(similarTokens, 'rank', 'asc');
    }

    if (Object.values(this.token.attributes).length > 4) {
      let id = 0;
      for (let i = 2; i <= 2; i++) {
        const combos = new Combination(this.token.attributes, i);
        for (const combo of combos) {
          let sameTokens = Object.values(tokenTraits);
          for (const trait of Object.values(combo)) {
            sameTokens = sameTokens.filter((token) => {
              let val = undefined;
              for (const attribute of token.attributes) {
                if (attribute.name === trait.name) {
                  val = attribute.value;
                }
             }
             return trait.value === val;
            });
          }

          // only count ones where rarity <= 2%
          if (sameTokens.length > 0 && sameTokens.length <= 84) {
            this.metaTraits.push({
              id: id++,
              combo: combo,
              num: sameTokens.length
            });
          }
        }
      }
    }

    this.metaTraits = _.sortBy(this.metaTraits, 'num', 'asc');

    let numAttributes = {};

    for (const attributes of Object.values(tokenTraits)) {
      for (const attribute of attributes.attributes) {
        if (!Object.prototype.hasOwnProperty.call(this.traits, attribute.name)) {
          this.traits[attribute.name] = {};
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

    // Add in missing attribute counts
    for (const [ key, attribute ] of Object.entries(this.traits)) {
      this.traits[key] = Object.fromEntries(Object.entries(this.traits[key]).sort());
      if (key !== 'Magnificent' && key !== 'Special' && key !== '# Traits') {
        this.traits[key]['<None>'] = this.totalTokens - Object.values(attribute).reduce((a, b) => a + b, 0);
      }
    }
  },
  methods: {
    transformUri(uri) {
      return ipfs.transformUri(uri);
    }
  }
}
</script>

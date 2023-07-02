<template>
  <el-container id="app">
    <el-header style="padding: 20px;">
      <h1>Evolution Gallery</h1>
    </el-header>
    <router-view :key="$route.name + ($route.params.id || '')"></router-view>
    <el-footer>
      <el-link :underline="false" href="https://twitter.com/mycodecrafting" target="_blank"><i class="fab fa-twitter" style="color: #1DA1F2"></i></el-link> Built by Codecrafting Labs. Made with <i class="fas fa-heart" style="color: #F64947"></i>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  background: #080808;
}

body {
  font-family: 'DM Sans', sans-serif;
  color: #fff;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
}

#home, #token {
    padding: 0 10px;
}

.el-link.el-link--default {
    color: #fff !important;
}
.el-card {
    color: #fff !important;
    background-color: #000 !important;
    border-color: #454545 !important;
}

.el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 2px 12px 0 rgb(255 255 255 / 25%) !important;
}

.el-divider {
    background-color: #454545 !important;
}

.el-header {
    position: relative;
    height: auto !important;
    color: #fff;
    background: url(./assets/ottez-hero-1.png) no-repeat;
    background-position: center center;
    background-size: cover;
    margin-bottom: 24px;
}

.el-header h1,
#token h2,
h2 span {
  font-family: 'Rancho', cursive;
  color: #ef955f;
}

.el-header h1,
#token h2 {
    font-size: 4.5em;
    margin-top: 12px;
    margin-bottom: 0px;
}
.el-header h1 {
    margin-top: 12px;
    margin-bottom: 12px;
    background: rgba(0,0,0,0.5);
    border-radius: 6px;
    padding: 6px 12px;
}

#token h2 {
    font-size: 2.5em;
    margin-bottom: 24px;
}

@media only screen and (max-width:767px) {
    .el-header h1 {
        font-size: 3.5em;
    }
}

.fa-icon-right {
    margin-left: 6px;
}

.el-header span {
    font-size: 24px;
    text-transform: uppercase;
}

.menu {
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.10) !important;
}

.menu .el-collapse-item__header {
    font-size: 16px;
    color: #fff !important;
}
.menu .el-checkbox__label {
    font-size: 12px;
    display: inline-block;
    width: 100%;
}
.menu .el-collapse-item__content, .menu .el-checkbox {
    color: #fff;
}
.menu .el-collapse {
    border-top: 1px solid #ababab;
    border-bottom: 1px solid #ababab;
}
.menu .el-input__inner {
    color: #fff;
    background: transparent;
}

.el-tag {
    font-size: 10px !important;
}
.el-tag--dark {
    background-color: #000 !important;
    border-color: #909399 !important;
}
.el-tag--dark.el-tag--info {
    background-color: #909399 !important;
    border-color: #909399 !important;
}

.active-filters .el-tag {
    margin-left: 8px;
    border-radius: 18px;
}

.menu .el-checkbox:last-of-type {
    margin-right: 30px !important;
}

.menu .el-collapse-item__wrap,
.menu .el-collapse-item__header {
    background: transparent;
    border-bottom: 1px solid #ababab;
}

.el-select-dropdown {
    background: #000 !important;
}
.el-select-dropdown__item {
    color: #fff !important;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
    background-color: #2b2b2b !important;
}
.el-select-dropdown__item.selected {
    color: #dc7551 !important;
}

.el-collapse-item:last-child .el-collapse-item__wrap,
.el-collapse-item:last-child .el-collapse-item__header {
    border-bottom: none !important;
}

.el-checkbox {
    display: block !important;
}

.el-footer {
    text-align: center;
    margin-top: 60px;
    padding: 20px 0;
}

.el-empty {
    padding-top: 80px !important;
}
.el-empty__description {
    margin-top: 40px !important;
}
.el-empty__description p {
    font-size: 24px !important;
}
.el-empty__image {
    opacity: 0.5;
}

.el-breadcrumb {
    margin-bottom: 24px !important;
    font-size: 18px !important;
    color: #fff;
}

#token .el-descriptions__body {
    background: rgba(255, 255, 255, 0.10) !important;
    font-size: 14px;
    padding: 10px;
}
#token .el-descriptions-item__label {
    width: 33%;
    text-align: right;
    font-weight: bold;
    font-size: 1em;
    text-transform: uppercase;
    color: #fff;
    line-height: 1.6em;
}
#token .el-descriptions-item__content {
    width: 65%;
    color: #c8c8c8;
}
#token .trait-combos .el-card .el-divider {
    margin-top: 0 !important;
    margin-bottom: 12px !important;
}
#token .trait-combos .el-card  .el-descriptions__body {
    font-size: 14px;
}
#token .trait-combos .el-card .el-descriptions-item__label {
    width: 40%;
}
#token .trait-combos .el-card .el-descriptions-item__content {
    width: 58%;
}

.price {
    color: #666;
}

.el-popover {
    background: #1a1a1a !important;
}
.el-popover .el-descriptions__title {
    font-family: 'Rancho', cursive;
    color: #dc7551 !important;
}
.el-popover .el-descriptions__body {
    color: #fff;
    background: transparent;
}
.el-popover .el-descriptions .is-bordered .el-descriptions-item__cell {
    border-color: #454545;
}
.el-popover .el-descriptions-item__label.is-bordered-label {
    color: #fff;
    background: transparent;
}

</style>

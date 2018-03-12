<template>
<div class="row">
  <div class="col-sm-5">
    <div class="dataTables_info">
      当前显示 {{ start }} 到 {{ end }} 条，共 {{ total }} 条记录
    </div>
  </div>
  <div class="col-sm-7">
    <div class="dataTables_paginate paging_simple_numbers">
      <ul class="pagination">
        <li v-bind:class="['paginate_button', 'previous', curr == 1 ? 'disabled' : '']">
          <a href="javascript:;" @click="change(1)">第一页</a>
        </li>
        <li v-bind:class="['paginate_button', curr == 1 ? 'disabled' : '']">
          <a href="javascript:;" @click="change(curr - 1)">上一页</a>
        </li>
        <template v-for="page in pages">
          <li v-bind:class="['paginate_button', page == curr ? 'active' : '']">
            <a href="javascript:;" @click="change(page)">{{ page }}</a>
          </li>
        </template>
        <li v-bind:class="['paginate_button', curr == max ? 'disabled' : '']">
          <a href="javascript:;" @click="change(curr + 1)">下一页</a>
        </li>
        <li v-bind:class="['paginate_button', 'next', curr == max ? 'disabled' : '']">
          <a href="javascript:;" @click="change(max)">最后一页</a>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'Pagination',

    props: {
      size: {
        type: Number,
        default: 10
      },

      curr: {
        type: Number,
        default: 1,
        twoWay: true,
      },

      total: {
        type: Number,
        default: 1,
        required: true
      },
      pageAction: {
        type: String,
        required: true
      }
    },
    computed: {
      pages: function() {
        let pages = this.max;
        if (pages > 5) {
          if (this.curr <= 3) {
            pages = [1, 2, 3, 4, 5];
          } else if (this.curr >= pages - 2) {
            pages = [
              pages - 4,
              pages - 3,
              pages - 2,
              pages -1,
              pages
            ];
          } else {
            pages = [this.curr - 2, this.curr - 1, this.curr, this.curr + 1, this.curr + 2]
          }
        } else {
          pages = [];
          for (let i = 1; i <= this.max; i++) {
            pages.push(i);
          }
        }
        if (!pages.length) pages = [1];
        return pages;
      },

      start: function() {
        let start = (this.curr - 1) * this.size + 1;
        return this.total == 0 ? 0 : start;
      },

      end: function() {
        let end = this.curr * this.size;
        return end > this.total ? this.total : end;
      },

      max: function() {
        let p = (this.total / this.size);
        let max = parseInt(this.total % this.size == 0 ? p : p + 1);
        return max < 1 ? 1 : max;
      }
    },

    data() {

      return {
      }
    },

    methods: {
      change: function(page) {
        if (page > this.max) page = this.max;
        if (page < 1) page = 1;
        this.curr = page;

        this.$dispatch('pagination:change', this.curr, (this.curr - 1) * this.size, this.size, this.pageAction);
      }
    }
  }
</script>

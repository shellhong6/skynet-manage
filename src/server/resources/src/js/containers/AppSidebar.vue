<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <!-- <div class="user-panel">
        <div class="pull-left image">
          <img :src="userInfo.icon" class="img-circle" alt="User Image">
        </div>
        <div class="pull-left info">
          <p>{{userInfo.nick_name}}</p>
          <a href="javascript:;"><i class="fa fa-circle text-success"></i> {{userInfo.email}}</a>
        </div>
      </div> -->

      <ul class="sidebar-menu">
        <li class="header">功能导航</li>
        <li v-for="tree in treeview"
          v-bind:class="{
            'treeview': true,
            'active': isActivePath($route.path, tree)
          }">
          <a href="javascript:;">
            <i v-bind:class="['fa', tree.icon]"></i>
            <span>{{ tree.title }}</span>
            <i class="fa fa-angle-left pull-right"></i>
          </a>
          <ul class="treeview-menu">
            <li v-for="item in tree.children"
              v-bind:class="{ 'active': isActiveSubPath($route.path, item.url) }">
              <a v-link="{ path: item.url }">
                <i v-bind:class="['fa', item.icon ? item.icon : 'fa-circle-o']"></i>
                {{item.title}}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
  import { getTreeView } from '../vuex/actions';
  import {
    preferencesTreeView,
    userInfo,
  } from '../vuex/getters';
  export default {
    name: 'AppSidebar',

    vuex: {
      actions: {
        getTreeView
      },

      getters: {
        treeview: preferencesTreeView,
        userInfo,
      }
    },

    data() {
      return {

      }
    },

    methods: {
      isActivePath(path, item) {
        let r = false;
        let reg = /\/\w*\//i;

        for (let i = 0; i < item.children.length; i++) {
          //属于/a/b 这样的路径
          if (reg.test(path)) {
            if (item.children[i].url == path.substr(0, path.substr(1).indexOf('/') + 1)) {
              r = true;
              break;
            }
          } else {
            if (item.children[i].url == path || path.replace(/\d\?/, '0?') == item.children[i].url) {
              r = true;
              break;
            }
          }
        }

        return r;
      },

      isActiveSubPath(path, url) {
        let reg = /\/\w*\//i;
        if (reg.test(path)) {
          return url == path.substr(0, path.substr(1).indexOf('/') + 1);
        } else {
          return path == url || path.replace(/\d\?/, '0?') == url;
        }
      }
    },

    created() {
      this.getTreeView();
    }
  }
</script>

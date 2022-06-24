<template>
  <section class="footer">
    <div class="container container-sm container-lg container-xs">
      <div class="row row-30">
        <div class="col-10 col-md-6 col-lg-10 col-xl-3">
          <h5>关于极客范</h5>
          <p>
            &quot;极客范儿&quot;(Geek
            Fun)是一套完整的可扩展Web开发案例库，供广大学习者使用。通过开发这个项目，可以学习到完整的Web开发相关技术环节，掌握完整的Web开发工具栈。
          </p>
          <p class="p2">
            &quot;极客范儿&quot;的底层是一个全功能可真实运营的通用小型电子商城，极客范儿通过销售丰富多彩的极客风格的马克杯、啤酒杯和搪瓷杯，演示这个系统的实际功能，用户可以实际体验它的功能逻辑。
          </p>
        </div>
        <div class="col-10 col-md-6 col-lg-4 col-xl-3">
          <h5>导航</h5>
          <ul>
            <li>
              <router-link :to="$store.state.appSettings.route.mug">
                茶与咖啡兼顾的极客范儿十足的马克杯
              </router-link>
            </li>
            <li>
              <router-link :to="$store.state.appSettings.route.beer">
                朋友欢聚必备的啤酒杯
              </router-link>
            </li>
            <li>
              <router-link :to="$store.state.appSettings.route.enamel">
                除了当杯子还能当花瓶的搪瓷杯
              </router-link>
            </li>
            <li>
              <router-link to="/articles/0/1">杯言杯语话开发</router-link>
            </li>
            <li><router-link to="/contact">极客范儿</router-link></li>
          </ul>
        </div>
        <div class="col-10 col-md-6 col-lg-4 col-xl-3">
          <h5>近期文章</h5>
          <ul class="recent-posts-ul">
            <li>
              <p>杯言杯语</p>
              <p>
                <a>茶杯与软件开发的紧密联系</a>
              </p>
            </li>
            <li>
              <p>杯言杯语</p>
              <p>
                <a>咖啡因对软件开发的决定性作用</a>
              </p>
            </li>
            <li>
              <p>杯言杯语</p>
              <p><a>杯子与容器的关系</a></p>
            </li>
          </ul>
        </div>
        <div class="col-10 col-md-6 col-lg-4 col-xl-3">
          <h5>联系方式</h5>
          <ul class="contact-ul">
            <li>
              <label>
                地址：
              </label>
              <span>
                北京市朝阳区北苑路13号领地OFFICE C座
              </span>
            </li>
            <li>
              <label>
                电话：
              </label>
              <ul class="phone-list">
                <li><a href="#">(800) 123-0045</a></li>
                <li><a href="#">(800) 123-0045</a></li>
              </ul>
            </li>
            <li>
              <label>
                邮箱：
              </label>
              <span>
                <a href="#">wenq@artech.cn</a>
              </span>
            </li>
            <li>
              <label>
                工作时间：
              </label>
              <span>
                10AM ~ 8PM
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .footer {
    font-size: 14px;
    line-height: 1.7;
    padding: 80px 0;
    background: $bottomColor;

    .recent-posts-ul {
      li {
        margin-bottom: 5px;
        p:first-child {
          font-size: 12px;
        }

        p:last-child {
          color: $fontActiveColor;
        }
      }
    }

    .p2 {
      margin-top: 20px;
    }
  }
</style>

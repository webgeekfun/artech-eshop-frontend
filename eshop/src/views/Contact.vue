<template>
  <div class="contact-page">
    <!-- 面包屑导航 -->
    <vue-breadcrumb page-name="极客范儿" />

    <section class="section-md">
      <div class="container container-sm container-lg container-xs">
        <div class="information-introduction text-left">
          <p>
            &quot;极客范儿&quot;(Geek
            Fun)是一套完整的可扩展Web开发案例库，供广大学习者使用。通过开发这个项目，可以学习到完整的Web开发相关技术环节，掌握完整的Web开发工具栈。
          </p>
          <p>
            &quot;极客范儿&quot;的底层是一个全功能可真实运营的通用小型电子商城，极客范儿通过销售丰富多彩的极客风格的马克杯、啤酒杯和搪瓷杯，演示这个系统的实际功能，用户可以实际体验它的功能逻辑。
          </p>
        </div>

        <div class="mt50 row row-50">
          <div class="col-md-5 col-lg-4">
            <h1>CONTACT</h1>
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
          <div class="col-md-7 col-lg-8">
            <h1>GET IN TOUCH</h1>
            <div>
              <div class="mb-4">
                <input
                  type="text"
                  placeholder="您的姓名"
                  class="form-control"
                  id="name"
                />
              </div>
              <div class="mb-4">
                <input
                  type="email"
                  placeholder="您的邮箱"
                  class="form-control"
                  id="email"
                />
              </div>
              <div class="mb-4">
                <input
                  type="number"
                  placeholder="您的手机号码"
                  class="form-control"
                  id="phone"
                />
              </div>
              <div>
                <textarea
                  placeholder="备注信息"
                  class="form-control"
                  id="message"
                  rows="6"
                ></textarea>
              </div>
              <div type="submit" class="button button-primary">Send</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .contact-page {
    h1 {
      margin-bottom: 35px;
    }
  }
</style>

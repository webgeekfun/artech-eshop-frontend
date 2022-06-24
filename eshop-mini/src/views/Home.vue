<template>
  <div>
    <div class="container text-center py-5">
      <div class="row py-lg-4">
        <div class="col-md-8 mx-auto">
          <h1 class="fw-light">学会软件开发，点亮你的技能树</h1>
          <p class="lead text-muted">
            "极客范"(Geek Fun)是一套完整的可扩展Web开发案例库。
            通过开发这个项目，可以学习到完整的Web开发相关技术环节，
            掌握完整的Web开发工具栈。
          <p>
            <router-link 
              class="btn btn-primary m-2" 
              to="products"
            >
              查看产品
            </router-link>
            <router-link 
              class="btn btn-secondary m-2" 
              to="orders"
            >
              查看订单
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <div class="py-4 bg-light">
      <div class="container">
        <div class="row ">
          <div class="col-md-3 my-3" >
            <h3 class="fw-light mb-4">前端框架</h3>
            <ul>
              <li>Vue.js     </li> 
              <li>Bootstrap5 </li> 
              <li>Vuex       </li>
              <li>Router     </li>
              <li>Sass      </li>
              <li>Axios      </li>
            </ul>
          </div>
    
          <div class="col-md-3 my-3" >
            <h3 class="fw-light mb-4">C#</h3>
            <ul>
              <li>.NET Core 5.0</li>
              <li>ASP.NET Core 5.0</li>
              <li>EF Core 5.0 </li>
              <li>Pomelo</li>
              <li>AutoMapper</li>
              <li>FluentValidation</li>
            </ul>
          </div>

          <div class="col-md-3 my-3" >
            <h3 class="fw-light mb-4">Python</h3>
            <ul>
              <li>Django</li>
              <li>Django Rest Framework</li>
              <li>Simple JWT</li>
              <li>uWSGI</li>
            </ul>
          </div>

          <div class="col-md-3 my-3" >
            <h3 class="fw-light mb-4">Java</h3>
            <ul>
              <li>JDK 1.8</li>
              <li>Spring Framework</li>
              <li>Spring Boot</li>
              <li>Jpa</li>
            </ul>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row g-3 py-4 mt-4 fs-5 text-center">
        <div class="col-6 col-md-4 col-lg-2">
          <div class="border rounded p-3">前端多框架</div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="border rounded p-3">适配多终端</div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="border rounded p-3">后端多语种</div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="border rounded p-3">开发全流程</div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="border rounded p-3">工具全开源</div>
        </div>
        <div class="col-6 col-md-4 col-lg-2">
          <div class="border rounded p-3">架构模块化</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
}
</script>

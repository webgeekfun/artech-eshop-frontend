// 时间转换
function formatTen(num) {
  return num > 9 ? num + '' : '0' + num;
}
export default {
  install(Vue) {
    // 分页
    Vue.prototype.$paging = function(totalPage, half, page) {
      let left = 1;
      let right = totalPage;
      if (totalPage >= half * 2 + 1) {
        if (page > half + 1 && page < totalPage - half) {
          left = page - half;
          right = page + half;
        } else if (page <= half + 1) {
          left = 1;
          right = half * 2 + 1;
        } else {
          right = totalPage;
          left = totalPage - half * 2;
        }
      }
      const range = [];
      while (left <= right) {
        range.push(left);
        left++;
      }
      return range;
    };

    // 时间转换
    Vue.prototype.$formatDate = function(isShowHour = true, time) {
      var date1 = new Date(time);
      var year = date1.getFullYear();
      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      var hour = date1.getHours();
      var minute = date1.getMinutes();
      var second = date1.getSeconds();
      if (isShowHour) {
        return (
          year +
          '-' +
          formatTen(month) +
          '-' +
          formatTen(day) +
          ' ' +
          formatTen(hour) +
          ':' +
          formatTen(minute) +
          ':' +
          formatTen(second)
        );
      } else {
        return year + '-' + formatTen(month) + '-' + formatTen(day);
      }
    };

    // 根据数组中的某个属性值判断是否存在某个属性值
    Vue.prototype.$findElem = function(arrayToSearch, attr, val) {
      for (let i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
          return i;
        }
      }
      return -1;
    };

    Vue.prototype.$groupBy = function(array, f) {
      const groups = {};
      array.forEach(function(o) {
        const group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map(function(group) {
        return groups[group];
      });
    };
  }
};

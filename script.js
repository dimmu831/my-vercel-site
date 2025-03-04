fetch("https://script.google.com/macros/s/AKfycbzToRBXwpG8EqeO_SZYo1Cmmo7IXE6h_PBdP7ok06n2liWKUcYTDwhRzksYgPz7gw/exec")
  .then(res => res.json())
  .then(data => {
    let labels = [];
    let btcData = [];
    let ethData = [];
    let etcData = [];

    // 跳過第一行「最新價格」，只取第二行開始的數據
    let rows = data.slice(2);

    // 轉換時間格式並存入數據陣列
    rows.forEach(row => {
      let rawDate = row[0]; // 原始日期格式
      let formattedDate = new Date(rawDate).toISOString().split("T")[0]; // 轉換成 YYYY-MM-DD
      labels.push(formattedDate);  // X 軸標籤
      btcData.push(row[1]); // BTC/USD
      ethData.push(row[2]); // ETH/USD
      etcData.push(row[3]); // ETC/ETH
    });

    // 繪製 Chart.js 折線圖
    let ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "BTC/USD",
            data: btcData,
            borderColor: "red",
            fill: false
          },
          {
            label: "ETH/USD",
            data: ethData,
            borderColor: "blue",
            fill: false
          },
          {
            label: "ETC/ETH",
            data: etcData,
            borderColor: "green",
            fill: false
          }
        ]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "日期"
            }
          },
          y: {
            title: {
              display: true,
              text: "價格變化 (%)"
            }
          }
        }
      }
    });

    // 生成 Google Sheets 數據表格
    let headers = data[1]; // 取標題列
    let output = "<h2>Google Sheets 數據</h2><table><tr>";
    headers.forEach(title => output += `<th>${title}</th>`);
    output += "</tr>";

    rows.forEach(row => {
      output += "<tr>";
      row.forEach(value => output += `<td>${value}</td>`);
      output += "</tr>";
    });

    output += "</table>";
    document.getElementById("data-container").innerHTML = output;
  })
  .catch(error => console.error("發生錯誤:", error));

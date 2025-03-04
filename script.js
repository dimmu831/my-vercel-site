fetch("https://script.google.com/macros/s/AKfycbzToRBXwpG8EqeO_SZYo1Cmmo7IXE6h_PBdP7ok06n2liWKUcYTDwhRzksYgPz7gw/exec")
  .then(res => res.json())
  .then(data => {
    let labels = [];
    let btcData = [];
    let ethData = [];
    let etcData = [];

    // 跳過第一行「最新價格」，只取第二行開始的數據
    let rows = data.slice(2);

    // 格式化數據
    let formattedData = rows.map(row => {
        let rawDate = row[0]; 
        let formattedDate = new Date(rawDate).toISOString().split("T")[0]; // 轉換成 YYYY-MM-DD
        return [
            formattedDate, // 時間
            (row[1] * 100).toFixed(2) + "%", // BTC/USD 百分比
            (row[2] * 100).toFixed(2) + "%", // ETH/USD 百分比
            (row[3] * 100).toFixed(2) + "%"  // ETC/ETH 百分比
        ];
    });

    // 更新圖表數據
    formattedData.forEach(row => {
      labels.push(row[0]);  // X 軸時間
      btcData.push(parseFloat(row[1])); // BTC/USD
      ethData.push(parseFloat(row[2])); // ETH/USD
      etcData.push(parseFloat(row[3])); // ETC/ETH
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
    let output = "<table><tr><th>Time</th><th>BTCUSD</th><th>ETHUSD</th><th>ETCETH</th></tr>";
    
    formattedData.forEach(row => {
      output += `<tr>
          <td>${row[0]}</td>
          <td>${row[1]}</td>
          <td>${row[2]}</td>
          <td class="${parseFloat(row[3]) < 0 ? 'negative' : ''}">${row[3]}</td>
      </tr>`;
    });

    output += "</table>";
    document.getElementById("data-container").innerHTML = output;
  })
  .catch(error => console.error("發生錯誤:", error));

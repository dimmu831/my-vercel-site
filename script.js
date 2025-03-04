fetch("https://script.google.com/macros/s/AKfycbzToRBXwpG8EqeO_SZYo1Cmmo7IXE6h_PBdP7ok06n2liWKUcYTDwhRzksYgPz7gw/exec")
  .then(res => res.json())
  .then(data => {
    let labels = [];
    let btcData = [];
    let ethData = [];
    let etcData = [];

    // 跳過第一行「最新價格」，只取第二行開始的數據
    let rows = data.slice(2); 

    // 確保數據從時間開始，而非 "最新價格"
    rows.forEach(row => {
      labels.push(row[0]);  // "Time" 列作為 X 軸
      btcData.push(row[1]); // BTC/USD
      ethData.push(row[2]); // ETH/USD
      etcData.push(row[3]); // ETC/ETH
    });

    // 繪製 Chart.js 折線圖（不包含「最新價格」）
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
      }
    });

    // 生成 Google Sheets 數據表格（不影響）
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

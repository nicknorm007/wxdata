const puppeteer = require('puppeteer');

const url = "https://www.cocorahs.org/ViewData/ListDailyPrecipReports.aspx";
const station_field = "#frmPrecipReportSearch_ucStationTextFieldsFilter_tbTextFieldValue"
const search_btn = "#frmPrecipReportSearch_btnSearch"
const station_number_chkbox = "#frmPrecipReportSearch_ucStationTextFieldsFilter_cblTextFieldsToSearch_0"
const start_date = "#frmPrecipReportSearch_ucDateRangeFilter_dcStartDate_t"
const end_date = "#frmPrecipReportSearch_ucDateRangeFilter_dcEndDate_t"
const wilmington_station = "MA-MD-85"

function run () {

  return new Promise(async (resolve, reject) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //fill in form
        await page.goto(url);
        await page.type(station_field, wilmington_station);
        await page.click(station_number_chkbox)
        await page.type(start_date, "07/01/2021");
        await page.type(end_date, "07/18/2021");
        await Promise.all([page.waitForNavigation(), page.click(search_btn)]);
        
        let totals = await page.evaluate(() => {
          const all_precips_selector = "tr[class$='Item'] > td:nth-child(5)"
          let results = [];
          let items_all = document.querySelectorAll(all_precips_selector);
          items_all.forEach((item) => {
            let t = item.innerText.trim()
            results.push( parseFloat(t) );
          });
          const total_sums = (acc, current) => acc + current;
          return results.reduce(total_sums);
        })

        browser.close();
        return resolve(totals);
    } catch (e) {
        return reject(e);
    }
 })
}

run().then(console.log).catch(console.error);
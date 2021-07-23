const puppeteer = require('puppeteer');
const VIEWPORT = { width: 2048, height: 1080 };

const url = "https://www.cocorahs.org/ViewData/ListDailyPrecipReports.aspx";
const station_field = "#frmPrecipReportSearch_ucStationTextFieldsFilter_tbTextFieldValue"
const search_btn = "#frmPrecipReportSearch_btnSearch"
const station_number_chkbox = "#frmPrecipReportSearch_ucStationTextFieldsFilter_cblTextFieldsToSearch_0"
const start_date = "#frmPrecipReportSearch_ucDateRangeFilter_dcStartDate_t"
const end_date = "#frmPrecipReportSearch_ucDateRangeFilter_dcEndDate_t"
const wilmington_station = "MA-MD-85"
const next_selector = "#ucReportList_wcNextPager2"
const select_pager = "#ucReportList_wcDropDownListPager"

var logger = function(text) { console.log(text); };

function run () {

  return new Promise(async (resolve, reject) => {
    try {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setViewport(VIEWPORT);
        await page.exposeFunction("logger", logger);
        
        //fill in form
        await page.goto(url);
        await page.type(station_field, wilmington_station);
        await page.click(station_number_chkbox)
        await page.type(start_date, "01/01/2021");
        await page.type(end_date, "07/23/2021");
        await Promise.all([page.waitForNavigation(), page.click(search_btn)]);
        
        const dropdowns = await page.$$eval("select" + select_pager + " option", all => all.map(a => a.textContent))
        let num_pages = dropdowns == 0 ? 1 : dropdowns.length;
        let grand_totals = 0;
        
        for(let pgs=1; pgs<=num_pages; pgs++)
        {
        
          if(pgs > 1)
          {
            await page.click(next_selector);
            await page.waitForNavigation();
          }
          
          let totals = await page.evaluate( async () => {
            
            let total_sums = (acc, current) => acc + current;
            let all_precips_selector = "tr[class$='Item'] > td:nth-child(5)"
            let items_all = document.querySelectorAll(all_precips_selector);
            let results = [];
            items_all.forEach((item) => {
              let t = item.innerText.trim();
              if(t !== "T"){
                results.push( parseFloat(t) );
              }
            });
            return (results.reduce(total_sums)).toFixed( 2 );
          })
          grand_totals = parseFloat(grand_totals) + parseFloat(totals)
        //end
      }

        browser.close();
        return resolve(grand_totals);

    } catch (e) {
        return reject(e);
    }
 })
}

run().then((value) => {
  console.log(value);
}).
catch(function errorHandler(err) {
  console.log(err.message)
});

const puppeteer = require('puppeteer');

const url = "https://www.cocorahs.org/ViewData/ListDailyPrecipReports.aspx";
const station_field = "#frmPrecipReportSearch_ucStationTextFieldsFilter_tbTextFieldValue"
const search_btn = "#frmPrecipReportSearch_btnSearch"
const station_number_chkbox = "#frmPrecipReportSearch_ucStationTextFieldsFilter_cblTextFieldsToSearch_0"
const start_date = "#frmPrecipReportSearch_ucDateRangeFilter_dcStartDate_t"
const end_date = "#frmPrecipReportSearch_ucDateRangeFilter_dcEndDate_t"
const wilmington_station = "MA-MD-85"


async function run () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.type(station_field, wilmington_station);
  await page.click(station_number_chkbox)


  await page.click(search_btn)
  browser.close();
}

function logit() {

  console.log("")
}

run();
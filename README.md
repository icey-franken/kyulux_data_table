# kyulux_data_table



* resource for building simple table in react: https://blog.logrocket.com/complete-guide-building-smart-data-table-react/
  * I used create-react-app with react-table package

* consider: foods api at https://fdc.nal.usda.gov/api-spec/fdc_api.html#/
  * not sure if I can grab huge chunks of data with this to render in a table - possibly too big
* consider: NPS campground api at https://www.nps.gov/subjects/developer/api-documentation.htm#/
  * data seems fairly homogenous. Not perfect but I think I can make it work

* adverse food effects at https://api.fda.gov/food/event.json
  * can search up to 1000 (limit=1000) and skip previous results with skip=xxx (pagination)



var vueFreidok = new Vue({
  i18n: { locale: findPreferedLanguage(), messages: {en: {}, de: {} }},
  el: '#freidok', 
  data: {
         allPosterData: [],
         allDirectoriesData: [],
         allCountries : [], 
        },
  methods: {  
     inqCountries: function () {
       var volumesUrl = "https://globalchanges.github.io/PosterExplorer/meta/countries.json";
       axios
         .get(volumesUrl)
         .then(response => { 
            this.setCountries(response.data);
       });
     },
     setCountries: function(data) { this.allCountries = data; },



  },
 mounted () { 
     // this.inqFolders();

  },
  created () {
     this.inqCountries();
  }
}) 

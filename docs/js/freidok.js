

var i18n = new VueI18n({ locale: findPreferedLanguage(), messages: {en: {}, de: {} }});

var vueGCPE = new Vue({
  i18n: { locale: findPreferedLanguage(), messages: {en: {}, de: {} }},
  el: '#gcpe', 
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

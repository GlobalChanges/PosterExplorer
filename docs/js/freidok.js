

var vueFreidok = new Vue({
  el: '#freidok', 
  data: {
         allPosterData: [],
         allDirectoriesData: [],
         allCountries : [], 
         allTitles : [],
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
     inqFreidok: function (freidokId) {
       var freidokUrl = "https://freidok.uni-freiburg.de/jsonApi/v1/publications?available=issued&fieldset=lp&publicationId="+freidokId;
       axios
         .get(freidokUrl)
         .then(response => { 
            this.handleFreidok(response.data);
       });
     },
     handleFreidok: function(data) {
       if(data.numFound == 1) {
          var freidok = data.docs[0];
          if((freidok.pubtype.type == 'collection') || (freidok.pubtype.type == 'hierarchical_object'))  {
             for(var j=0; j<freidok.reverse_relations.length; j++) {
               var reverseDok = freidok.reverse_relations[j];
               if(reverseDok.type == 'is_part_of_rev') {
                 var nextId = reverseDok.norm_id.toString();
                 this.inqFreidok(nextId); 
               }        
             }
          }
          if(freidok.pubtype.type == 'poster') {

          }
          var title = "???";
          for(var t=0; t<freidok.titles.length; t++) {
             title = freidok.titles[t].value; 
          }
          this.allTitles.push({id:freidok.id.toString(), title:title, type:freidok.pubtype.type});
      } 
    }

  },
 mounted () { 
     // this.inqFolders();
     var startID = 165768;
     this.inqFreidokById(startID);
  },
  created () {
     this.inqCountries();
  }
}) 

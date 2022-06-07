

var vueFreidok = new Vue({
  el: '#freidok', 
  data: {
         allPosterData: [],
         allDirectoriesData: [],
         allCountries : [], 
         allTitles : []
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
     inqFreidokById: function (freidokId) {
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
                 this.inqFreidokById(nextId); 
               }        
             }
          }
          if(freidok.pubtype.type == 'poster') {
            var lang = "???";
            for(var l=0; t<freidok.languages.length; l++) {
             lang = freidok.languages[l].type; 
            }
            var title = "???";
            for(var t=0; t<freidok.titles.length; t++) {
             title = freidok.titles[t].value; 
            }
            var abstract = "???";
            for(var a=0; a<freidok.abstracts.length; a++) {
             abstract = freidok.abstracts[a].value; 
            }
            //  i.e. https://freidok.uni-freiburg.de/jsonApi/v1/publications?available=issued&fieldset=lp&publicationId=166128
            // relations[==parent!].order  ->  issue  
            // files[].link -> pdf
            // pub_ids[type=doi].value
            // keywords -> topic, country, continent, landscape
            // classifications -> continent, country
            // countries !!
            // persons -> hrsg, author
            var dokData = {id:freidok.id.toString(),
                           language:lang, /* needs conversion */ 
                           year:freidok.publication_year.value.toString(),
                           title:title, 
                           abstract:abstract,
                           license:freidok.license_metadata.type,  /* wrong - needs license from files! */
                           thumbnail:freidok.preview_image.thumbnail900,
                           icon:freidok.preview_image.thumbnail90, 
                           image:freidok.preview_image.link,
                           
                           type:freidok.pubtype.type

                          }
            this.allTitles.push(dokData);
          }
        }
      } 

  },
 mounted () { 
     // this.inqFolders();
     var startID = "165768";
     this.inqFreidokById(startID);
  },
  created () {
     this.inqCountries();
  }
}) 

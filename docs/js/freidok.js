

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
     freidok2Pdf: function () {
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF("p", "mm", "a4");
      pdf.setLanguage("de");
      pdf.setFontSize(24); pdf.setTextColor("#000000");
      pdf.text ("Collection of all Posters", 10, 10, {'maxWidth':200});
      for(var i=0; i<this.allTitles.length; i++) {
        var pub = this.allTitles[i];
        var n = i % 8;
        if(0 == n) {
          pdf.addPage();
        }
        if(0 == n) {
          pdf.addImage(pub.icon, 'PNG', 0, 40, 50, 50, pub.id, 'MEDIUM', 0);
          pdf.setFontSize(24); pdf.setTextColor("#000000");
          pdf.text (pub.title, 50, 10, {'maxWidth':200});
          pdf.setFontSize(12); pdf.setTextColor("#000000");
          pdf.text (pub.abstract, 50, 20, {'maxWidth':200});          
          pdf.addImage('./img/cc/'+pub.license+'.png', 'PNG', 0, 60, 60, 20, pub.license, 'MEDIUM', 0);
          var authors = ""
          for(var a=0; a<pub.authors.length; a++) {
             if(a>0) {authors += ", "}
             authors += (pub.authors.forename + ' ' + pub.authors.surname);
          }
          pdf.text (authors, 70, 60, {'maxWidth':200});
        }          


      }
      pdf.save ("freidok.pdf");

     },
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
            for(var l=0; l<freidok.languages.length; l++) {
             lang = freidok.languages[l].type; 
            }
            var title = "???";
            for(var t=0; t<freidok.titles.length; t++) {
              if(lang == freidok.titles[t].language) {
                title = freidok.titles[t].value; 
              }
            }
            var abstract = "???";
            for(var a=0; a<freidok.abstracts.length; a++) {
              if(lang == freidok.abstracts[a].language) {
                abstract = freidok.abstracts[a].value; 
              }
            }
            //  i.e. https://freidok.uni-freiburg.de/jsonApi/v1/publications?available=issued&fieldset=lp&publicationId=166128
            // relations[==parent!].order  ->  issue  
            // files[].link -> pdf // if zero->not published, CR-issues,...  
            // files_stat.has_cc_license -> true/false 
            // pub_ids[type=doi].value
            // keywords -> topic, country, continent, landscape
            // classifications -> continent, country
            // countries !!
            // persons -> hrsg, author
            var authors = [];
            for(var a=0; a<freidok.persons.length; a++) {
              var person = freidok.persons[a];
              if("author" == person.type) {
                authors.push({forename: person.forename, surname: person.surname});
              }
            }
            var license = "cr";
            var pdf = null;
            for(var f=0; f<freidok.files.length; f++) {
              var file = freidok.files[f];
              license = file.license.type;
              pdf = file.link;
            }
            var doi = null;
            for(var p=0; p<freidok.pub_ids.length; p++) {
              var pubid = freidok.pub_ids[p];
              if("doi" == pubid.type) {
                doi = "https://doi.org/"+pubid.value;
              }
            }

            var dokData = {id: freidok.id.toString(),
                           language: lang, /* needs conversion */ 
                           year: freidok.publication_year.value.toString(),
                           title: title, 
                           abstract: abstract,
                           authors: authors,
                           license: license,  /* wrong - needs license from files! */
                           thumbnail: freidok.preview_image.thumbnail900,
                           icon: freidok.preview_image.thumbnail90, 
                           image: freidok.preview_image.link,
                           doi: doi,
                           pdf: pdf, 
                           type: freidok.pubtype.type

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

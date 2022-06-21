

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
        var n = i % 16;
        if(0 == n) {
          pdf.addPage();
        }
        //var dy = 30*Math.floor(n/2)
        var dx = 100*(n % 2)
        var dy = 25*(n-(n%2))

        if(n < 6555) {
          if(pub.issue) {
            var thumb = "https://globalchanges.github.io/MetaData"+pub.year+"/"+pub.issue+"/thumbnail.png";
            pdf.addImage(thumb, 'PNG', dx+3, dy+5, 30, 30, pub.id, 'MEDIUM', 0);
          }
          pdf.setFontSize(8); pdf.setTextColor("#000000");
          pdf.text (pub.title.substring(0,150), dx+35, dy+5, {'maxWidth':60});
          pdf.setFontSize(5); pdf.setTextColor("#000000");
          pdf.text (pub.abstract.substring(0,400), dx+35, dy+15, {'maxWidth':60});    
          //if('ger' == pub.language) or ('eng' == pub.language)) {      
            pdf.addImage('img/'+pub.language+'.png', 'PNG', dx+35, dy+30, 10, 5, pub.language, 'MEDIUM', 0);
          //}
          pdf.addImage('img/cc/'+pub.license+'.png', 'PNG', dx+50, dy+30, 15, 5, pub.license, 'MEDIUM', 0);

          var authors = ""
          for(var a=0; a<pub.authors.length; a++) {
             if(a>0) {authors += ", "}
             authors += (pub.authors[a].forename + ' ' + pub.authors[a].surname);
          }
          pdf.setFontSize(7); pdf.setTextColor("#000000");
          pdf.text (authors, dx+70, dy+30, {'maxWidth':40});

          //pdf.textWithLink('Click here', x, y, { url: 'http://www.google.com' });
        }          


      }
      pdf.save("freidok.pdf");

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
            var issue = null;
            for(var r=0; r<freidok.relations.length; r++) {
              var rel = freidok.relations[r];
              if("is_part_of" == rel.type) {
                if("order" == rel.order_type) {
                  issue = rel.order;
                }
              }
            }
            if('2022' == freidok.publication_year.value) {
              issue = freidok.id.toString();
            }
            var dokData = {id: freidok.id.toString(),
                           issue: issue,
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

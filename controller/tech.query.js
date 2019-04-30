var promise = require('bluebird');
var Scraper = require('images-scraper')
  , bing = new Scraper.Bing();

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://bookmane:bookmane@localhost:5432/toolArchi';
var db = pgp(connectionString);


function getSingleTechMiddle(req, res, next) {
  
  var techName = (req.params.name);
  db.one('select * from tech where name = $1', techName)
    .then(function (data) {
      if (data) {
        imgRes = []
        db.many('select * from images where name = $1', data.name)
          .then(function (imgData) {
          
            for (var items in imgData) {

              imgRes.push({
                id:data.ID,
                name: data.name,
                height: imgData[items].height,
                width: imgData[items].width,
                url: imgData[items].url,
                type: imgData[items].type
              })
            }
            return res.status(200).send({
              success: 1,
              data: imgRes,
              
            })

          })
          .catch(function (err) {
            next()
          });



      }
      else {
        next()
      }
    })
    .catch(function (err) {
      next()
    });
}

function createTech(images, name) {
  info = " ";
  var date = new Date();
  db.none('insert into tech(name, info, date)' +
    'values(${name}, ${info}, ${date})',
    {
      name: name,
      info: info,
      date: date
    })

    .then(function () {
      for (var img in images) {
        db.none('insert into images(name, height  , width, url, type)' +
          'values(${name}, ${height}, ${width},${url},${type})',
          {
            name: name,
            height: images[img].height,
            width: images[img].width,
            url: images[img].url,
            type: images[img].type,

          }).then(function () {
            return ("success")
          })
          .catch(function (err) {
            console.log(err)
            return (err);
          })
      }
    })
    .catch(function (err) {
      console.log(err)
      return (err);
    });
}




function getSingleTech(req, res, next) {
  bing.list({
    keyword: req.params.name + ' logo png',
    num: 30,
    detail: true,
    nightmare: {
      show: false
    }
  })
    .then(function (data) {

      images = []
      var numImages = 0
      for (var img in data) {
        // 'a nice string'.includes('nice')
        if((data[img].url.includes('wikimedia') || (data[img].url.includes('iconfinder'))||(data[img].url.includes('icons8')) || (data[img].url.includes('flaticon')) || (data[img].url.includes('wikipedia'))) &&  numImages< 5){
          numImages++;
        images.push({
          name: req.params.name,
          height: data[img].height,
          width: data[img].width,
          url: data[img].url,
          type: data[img].type
        })
      }

      }
    
      res.status(200).send({
        success: 1,
        data: images
      })
    

    }).catch(function (err) {
      console.log(err)
      res.status(500).send({
        success: 0,
        err: err
      })
    });

}


function getAllTech(req, res, next) {
  db.any('select * from tech')
    .then(function (data) {
      res.status(200)
        .json({
          status: 1,
          data: data,
          message: 'Retrieved ALL puppies'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getAllTech: getAllTech,
  getSingleTechMiddle: getSingleTechMiddle,
  getSingleTech: getSingleTech,
  createTech: createTech,
  
  
};
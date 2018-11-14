var express = require("express");
var router = express.Router();

var MongoClient = require("mongodb").MongoClient;
var url =
    "mongodb://sa:Admin@cluster0-shard-00-00-5yfp7.azure.mongodb.net:27017,cluster0-shard-00-01-5yfp7.azure.mongodb.net:27017,cluster0-shard-00-02-5yfp7.azure.mongodb.net:27017/Restaurant?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

router.get("/", function(req, res, next) {
    MongoClient.connect(
        url,
        function(err, cn) {
            if (err) throw err;
            var db = cn.db("Restaurant");
            db.collection("Category")
                .find({})
                .toArray(function(err, result) {
                    if (err) throw err;
                    res.status(200).json(result);
                    cn.close();
                });
        }
    );
});

router.get("/:id", function(req, res, next) {
    var id = req.params.id;
    MongoClient.connect(
        url,
        function(err, cn) {
            if (err) throw err;
            var db = cn.db("Restaurant");
            db.collection("Category")
                .find({ id: id })
                .toArray((err,result)=>{
                    console.log(result);
                    cn.close();
                    ;res.status(200).json(result);
                });
        }
    );
});

router.post("/", function(req, res, next) {
    var data= req.body;
    MongoClient.connect(
        url,
        function(err, cn) {
            if (err) throw err;
            var db = cn.db("Restaurant");
            db.collection("Category")
                .insertOne(data)
                .then(result => {
                    cn.close();
                    res.status(200).json(result.insertedId);
                });
        }
    );
});

router.put("/", function(req, res, next) {
    var product= req.body;
    MongoClient.connect(
        url,
        function(err, cn) {
            if (err) throw err;
            var db = cn.db("Restaurant");
            db.collection("Category")
                .updateOne({id:product.id},
                           {$set:{name:product.name,price:product.price}},
                           {upsert:true},
                           (err,result)=>{
                            cn.close();
                            res.status(200).json(`符合項目${result.matchedCount}筆 , 修改${result.modifiedCount}筆 , 新增${result.upsertedCount}筆`);
                           });
        }
    );
});

router.delete("/",(req,res,next)=>{
    MongoClient.connect(
        url,
        function(err, cn) {
            if (err) throw err;
            var db = cn.db("Restaurant");
            db.collection("Category")
                .deleteMany({},err=>{
                    cn.close();
                    res.status(200).json('delete all ok');
                })
        }
    );
});

router.delete("/:id",(req,res,next)=>{
    var id=req.params.id;
    MongoClient.connect(
        url,
        function(err, cn) {
            if (err) throw err;
            var db = cn.db("Restaurant");
            db.collection("Category")
                .deleteOne({id:id},err=>{
                    cn.close();
                    res.status(200).json(`delete id=${id} ok`);
                })
        }
    );
});
module.exports = router;

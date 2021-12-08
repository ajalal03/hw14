

var fs = require('fs');
const fastcsv = require("fast-csv");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://adnanjalal:%40Adnanjalal1015@cluster0.obrwq.mongodb.net/companies?retryWrites=true&w=majority"
function main() 
{
    let stream = fs.createReadStream("companies.csv");
    let csvData = [];
    let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
        csvData.push({
        company: data[0],
        ticker: data[1]
        });
    })
    .on("end", function() {
        csvData.shift();

        console.log(csvData);
        
        MongoClient.connect(url, function(err, db) {
            if(db) {
                
                if(err) { console.log("connection error" + err);}
                var dbo = db.db("companies");
                var collection = dbo.collection('companies');
                console.log("Success!");
                collection.insertMany(csvData, (err, res) => {
                    if (err){
                         throw err;
                     }
                         db.close();
            });
        }
            else {
                console.log("oops");
            }
            console.log("Success!");
        });
    });
    stream.pipe(csvStream);
}

main();

import  fs from 'fs';

var obj = {
   table: [
      {id: 1, square:2}
   ]
};

var json = JSON.stringify(obj);

fs.writeFile('./content/post.json', json , function(err) {
   if (err) throw err;
   console.log('complete');
   }
);
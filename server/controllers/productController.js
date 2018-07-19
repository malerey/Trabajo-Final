let self = {};
const productService = require('../services/productService');


self.getid = function(req, res) {
  const id = req.params.id;

  productService.getid(id).then(idresult => {
    productService.getdesc(id).then(descresult => {
      productService.getCategory(idresult.category_id).then(catresult => {
        productService.getcurrency().then(currresult => {
        
          let categories = catresult.path_from_root.map(category => {
            return category.name;
          });

          const finalprice = Math.floor(idresult.price);
          let splitted = idresult.price.toString().split('.');
          let decimals = formatprice(splitted);

          function formatprice() {
            if (!parseInt(splitted[1])) {
              return '00';
            } else if (parseInt(splitted[1]) < 10) {
              return parseInt(splitted[1]) * 10;
            } else {
              return parseInt(splitted[1]);
            }
          }

          function getcurrency(currresult) {
            let currency_symbol = ''
            let currencies_id = currresult.map(currency_id => {
              let currencies_symbol = currresult.map(symbolmap => {
                if (symbolmap.id == idresult.currency_id) {
                  currency_symbol = symbolmap.symbol
                }
              })
            })
            return currency_symbol
          }

          const object = {
            author: {
              name: 'Maria Elena',
              lastname: 'Rey'
            },
            categories: categories,
            // this key is not requested in the exercise, but
            // I considered it necessary to build the breadcrumb
            item: {
              id: idresult.id,
              title: idresult.title,
              price: {
                currency: getcurrency(currresult),
                amount: finalprice,
                decimals: decimals
              },
              picture: idresult.pictures[0].secure_url,
              condition: idresult.condition,
              free_shipping: idresult.shipping.free_shipping,
              sold_quantity: idresult.sold_quantity,
              description: descresult.plain_text
            }
          };
          res.json(object);
        });
      });
    });
  });
};

module.exports = self;
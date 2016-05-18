# sparkpay node client

Node.js-based client wrapper for SparkPay REST API

<table>
<thead><tr><th>Known Issues</th></tr></thead>
<tbody><tr><td>
<ul><li>Only the <b>GET</b> method of requests works.</li>
<li>No support for requesting nested resources directly (must use expand).</li>
<li>No support for <b>multiple resource</b> or <b>filled</b> requests.</li></ul>
</td></tr></tbody>
<thead><tr><th>To Dos</th></tr></thead>
<tbody><tr><td>
<ul><li>Add <b>collect</b> method for collecting multiple page responses.</li></ul>
</td></tr></tbody></table>

---

## Installation

````bash
npm install sparkpay --save
````

## Initialization

Each client instance is initialized using the **init(config)** method. This allows multiple client instance for different storefronts and/or with unique API tokens for accessing different scopes of the API. The config should be an object with at least the required `domain` and `token` properties.

````js
var sparkpay = require('sparkpay').init({
  domain: 'example.com', // Your store's URL
  token: 'abcdefghijklmnopqrstuvwxyz123456' // API access token
});
````

## Config

````js
{
  // the url of the storefront you want this instance to access
  domain: 'example.com',

  // an API token with the scope permissions you want this instance to access
  token: 'abcdefghijklmnopqrstuvwxyz123456'
}
````

## Making Requests

Requests are made by specifying the method and the resource, as well as optional paramenters. Resource methods are named using **snake_case** to parallel the official designations as used in request URLs.

* You can find a [list of resources in the official documentation](https://github.com/SparkPay/rest-api/blob/master/resource_list.md).

For example, to request all the [gift certificates](https://github.com/SparkPay/rest-api/blob/master/resources/gift_certificates.md) issued in your store:

````js
sparkpay.get.gift_certificates();
````

Requests are Promise-based using [mzabriskie/axios](https://github.com/mzabriskie/axios) which implements [stefanpenner/es6-promise](https://github.com/stefanpenner/es6-promise) (a subset of [rsvp.js](https://github.com/tildeio/rsvp.js)).

For example, to log a list of order ID's and their order dates to the console:

````js
sparkpay.get.orders()
  .then(function(response) {
    // log the total count of orders to console
    console.log(response.total_count);
    // log each individual order id and order data to console
    response.orders.forEach(function(order) {
      console.log(order.id);
      console.log(order.ordered_at);
    });
  }).catch(function(error) {
    // log any error response
    console.log(error);
  });
````

For details about how to use promises, see the [JavaScript Promises HTML5Rocks article](http://www.html5rocks.com/en/tutorials/es6/promises/).

### Optional Request Parameters

Requests can include optional parameters based on the [common usage](https://github.com/SparkPay/rest-api/blob/master/common_usage.md) and [query syntax](https://github.com/SparkPay/rest-api/blob/master/query_syntax.md) described in the official documentation.

#### id

The **id** parameter requests a specific object from a resource rather than returning an array of matching objects.

So calling `sparkpay.get.orders()` may result in a response like:

````js
{
  total_count: 1,
  orders: [
    {
      id: 1,
      ordered_at: '2016-04-20T16:20:00-05:00'
      ...
    }
  ]
}
````
> This is the equivalent of an API request to `/api/v1/orders`

Whereas calling `sparkpay.get.orders( { id: 1 } )` will result in a response like:

````js
{
  id: 1,
  ordered_at: '2016-04-20T16:20:00-05:00'
  ...
}
````
> This is the equivalent of an API request to `/api/v1/orders/1`

---

#### fields

The **fields** parameter can be used to include in the response, as described under [common usage](https://github.com/SparkPay/rest-api/blob/master/common_usage.md#fields) in the official documentation.

If you want multiple fields, it should be an array:

````js
sparkpay.get.products({
  fields: [ 'id', 'item_name', 'item_number', 'price', 'categories' ]
})
````
> This is the equivalent of an API request to `/api/v1/products?fields=id,item_name,item_number,price,categories`

If you only want a single field included, it can be a string:

````js
sparkpay.get.products({
  fields: 'item_name'
})
````
> This is the equivalent of an API request to `/api/v1/products?fields=item_name`

For a list of available fields for the resource you are requesting, [check the official documentation](https://github.com/SparkPay/rest-api/blob/master/resource_list.md).

---

#### query

The **query** parameter should be an object with property names matching the field you want to query. The value can be a string or number if you simply want to search for matches.

For example, to search for orders with a status ID of 2:

````js
sparkpay.get.orders({
  query: {
    order_status_id: 2
  }
})
````

> This is the equivalent of a query using the **eq** comparison operator.

##### Comparison Operators

Alternatively, you may specify [comparison operators as described in the official documentation](https://github.com/SparkPay/rest-api/blob/master/query_syntax.md#comparison-operators).

###### eq
Returns results where a field is *equal* to the supplied value.

````js
sparkpay.get.products({
  query: {
    item_name: { op: 'eq', value: 'test' }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?item_name=test`

###### not
Returns results where a field is *not equal* to the supplied value.

````js
sparkpay.get.products({
  query: {
    item_name: { op: 'not', value: 'test' }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?item_name=not:test`

###### like
Returns results where a field contains the supplied value.

````js
sparkpay.get.products({
  query: {
    item_name: { op: 'like', value: 'test' }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?item_name=like:test`

###### gt
Returns results where a field is *greater than* the supplied value.

````js
sparkpay.get.products({
  query: {
    price: { op: 'gt', value: 5.00 }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?price=gt:5.00`

###### gte
Returns results where a field is *greater than or equal to* the supplied value.

````js
sparkpay.get.products({
  query: {
    price: { op: 'gte', value: 5.00 }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?price=gte:5.00`

###### lt
Returns results where a field is *less than* the supplied value.

````js
sparkpay.get.products({
  query: {
    price: { op: 'lt', value: 25.00 }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?price=lt:25.00`

###### lte
Returns results where a field is *less than or equal to* the supplied value.

````js
sparkpay.get.products({
  query: {
    price: { op: 'lte', value: 25.00 }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?price=lte:25.00`

##### Conjunction Operators

You may join comparison operators in a query using [conjunction operators as described in the official documentation](https://github.com/SparkPay/rest-api/blob/master/query_syntax.md#conjunction-operators).


###### AND
This is the default when multiple fields are specified in a query.

````js
sparkpay.get.products({
  query: {
    item_name: 'test',
    price: { op: 'gt', value: 5.00 }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?item_name=test&price=gt:5.00`

The **AND** conjunction operator can also be used to specify multiple comparison values for a single field by assigning a `value` property which is an array of the comparison operator queries you want to join together.


````js
sparkpay.get.products({
  query: {
    price: {
      op: 'AND',
      value: [
        { op: 'gt', value: 5.00 },
        { op: 'lte', value: 25.00 }
      ]
    }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?price=gt:5.00+AND+lte:25.00`

###### OR
Can be used to override the default `AND` behavior when multiple fields are specified in a query by assigning a single query to the `value` property.

````js
sparkpay.get.products({
  query: {
    item_name: { op: 'like', value: 'test' },
    price: {
      op: 'OR',
      value: { op: 'lte', value: 25.00 }
    }
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?item_name=like:test&price=OR+lte:25.00`

The **OR** conjunction operator can also be used to specify multiple comparison values for a single field by assigning a `value` property which is an array of the comparison operator queries you want to join together.

````js
sparkpay.get.products({
  item_name: {
    op: 'OR',
    value: [
      { op: 'like', value: 'doge' },
      { op: 'like', value: 'wow' }
    ]
  }
})
````
> This is the equivalent of an API request to `/api/v1/products?item_name=like:doge+OR+like:wow`

---

#### expand

The **expand** parameter can be used to specify a list of nested resources to be added to the response.

If you want to expand multiple nested resources, it should be an array:

````js
sparkpay.get.products({
  expand: [ 'categories' ,'attributes' ]
})
````
> This is the equivalent of an API request to `api/v1/products?expand=categories,attributes`

If you only want a single nest resource filled, it can be a string:

````js
sparkpay.get.products({
  expand: 'categories'
})
````
> This is the equivalent of an API request to `api/v1/products?expand=categories`

---

#### noCache

The **noCache** parameter can be used to include a `Cache-Control: no-cache` header in the request.

````js
sparkpay.get.products({
  query: { item_name: 'test' },
  noCache: true
})
````

See [Caching](https://github.com/SparkPay/rest-api#caching) in the official documentation for details.

### Timeouts

SparkPay stores are restricted to 50 requests per 10 seconds. If your request is rate limited, it will automatically be queued and retried after the time specified in the `Retry-After` header included in the response.
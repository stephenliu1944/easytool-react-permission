module.exports = [{
    request: {
        url: '/user/123'
    },
    response: {
        body: {
            id: 123,
            name: 'Stephen',
            email: 'xxx@gmail.com'
        }
    }
}, {
    request: {
        url: '/user/:id'
    },
    response: {
        body: {
            id: 123,
            name: 'Stephen',
            email: 'xxx@gmail.com'
        }
    }
}, {
    request: {
        url: '/user/*.do'
    },
    response: {
        body: {
            id: 123,
            name: 'Stephen',
            email: 'xxx@gmail.com'
        }
    }
}, {
    request: {
        url: '/user/**/list'
    },
    response: {
        body: [{
            id: 123, 
            name: 'Stephen',
            age: 30
        }, {
            id: 124, 
            name: 'Ricky',
            age: 20				
        }]
    }
}];

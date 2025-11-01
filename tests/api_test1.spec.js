import {test, expect} from '@playwright/test'

//comments
test.describe.serial('API TEST',()=>{
let id=0;
test('API Post', async({request})=>{
    const response= await request.post('https://reqres.in/api/users',{
        headers: {
            'x-api-key': 'reqres-free-v1',
        },
        data: {
            "first_name":"Virat",
            "email":"cricket@gmail.com",
        }
    })
    expect(response.status()).toBe(201)
    const text= await response.text();
    expect(text).toContain("Virat");
    const rejson= await response.json();
    id=rejson.id;

    test.info().attach('POST-response.json',{
        body: JSON.stringify(rejson,null,2),
        contentType: 'application/json'
    });
})

test('API Get Request',async({request})=>{
    const response= await request.get(`https://reqres.in/api/users?page=2/${id}`,{
        headers: {
            'x-api-key': 'reqres-free-v1',
        },
    })
    expect(response.status()).toBe(200)
    const text=await response.text()
    expect(text).toContain("Michael");
})

test('API Put', async({request})=>{
    console.log(id);
    const response= await request.put(`https://reqres.in/api/users/2/${id}`,{
        headers: {
            'x-api-key': 'reqres-free-v1',
        },
        data: {
            "first_name":"Virat Kohli",
            "email":"cricket@gmail.com",
        }
    })
    expect(response.status()).toBe(200)
    const text= await response.text();
    expect(text).toContain("Virat Kohli");
    console.log(await response.json());
})

test('PATCH API',async({request})=>{
    const response=await request.patch(`https://reqres.in/api/users/2/${id}`,{
        headers: {
            'x-api-key': 'reqres-free-v1'
        },
        data:{
            "email": "business@gmail.com"
        }
    })
    expect(response.status()).toBe(200)
    const text=await response.text();
    expect(text).toContain("business@gmail.com");
    console.log(await response.json());
})

test('API Delete', async({request})=>{
    console.log(id);
    const response= await request.delete(`https://reqres.in/api/users/2/${id}`,{
        headers: {
            'x-api-key': 'reqres-free-v1'
        },
    })
    expect(response.status()).toBe(204);
})
})
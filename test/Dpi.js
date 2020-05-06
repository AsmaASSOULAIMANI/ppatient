/*var Dpi = artifacts.require("./Dpi.sol");

contract("Dpi", function (accounts){
    var v;
    it("on deux patient", function() {
        return Dpi.deployed().then(function(instance) {
          return instance.patientCount();
        }).then(function(count) {
          assert.equal(count, 2);
        });
      });
      it("les données sont correctes ", function() {
        return Dpi.deployed().then(function(instance) {
          v = instance;
          return v.Patients(1);
        }).then(function(patient) {
          assert.equal(patient[0], 1, "contains the correct id");
          assert.equal(patient[1], "ASSOULAIMANI", "contains the correct name");
          assert.equal(patient[2], "le 03/05/2020", "contains the correct date");
          assert.equal(patient[3], "Mr.X", "contains the correct doctor");
          return v.Patients(2);
        }).then(function(patient) {
          assert.equal(patient[0], 2, "contains the correct id");
          assert.equal(patient[1], "Aicha", "contains the correct name");
          assert.equal(patient[2],"le 03/05/2020", "contains the correct date");
          assert.equal(patient[3], "Mr.X", "contains the correct doctor");

        });
      });
    
})*/

const Dpi = artifacts.require('./Dpi.sol')

const newLocal = 'chai'
require(newLocal)
  .use(require('chai-as-promised'))
  .should()

contract('Dpi', ([deployer, author, tipper]) => {
  let dpi

  before(async () => {
    dpi = await Dpi.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await dpi.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    /*it('has a name', async () => {
      const name = await dpi.name()
      assert.equal(name, 'Dapp University Social Network')
    })*/
  })



describe('drug', async () => {
  let result, drugCount
  before(async () => {
    result = await dpi.addDrug('this is the first drug', { from: author })
    drugCount = await dpi.drugCount()
  })

  it('add drug', async () => {
    
    // SUCESS
    assert.equal(drugCount, 1)
    const event = result.logs[0].args
    assert.equal(event.iid.toNumber(), drugCount.toNumber(), 'id is correct')
    assert.equal(event.content, 'this is the first drug', 'content is correct')
    assert.equal(event.tipAmout, '0', 'tip amount is correct')
    assert.equal(event.author, author, 'author is correct')
    // FAILURE: Post must have content
    await dpi.addDrug('', { from: author }).should.be.rejected;

  })
  it('lists drug', async () => {
    const post = await dpi.drugs(drugCount)
    assert.equal(post.iid.toNumber(), drugCount.toNumber(), 'id is correct')
    assert.equal(post.content, 'this is the first drug', 'content is correct')
    assert.equal(post.tipAmout, '0', 'tip amount is correct')
    assert.equal(post.author, author, 'author is correct')
  })
    it ('allows users to tip drugs' , async() =>{
       // Track the author balance before purchase
       let oldAuthorBalance
       oldAuthorBalance = await web3.eth.getBalance(author)
       oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
      result = await dpi.tipdurg(drugCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
    // SUCESS
    //assert.equal(drugCount, 1)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), drugCount.toNumber(), 'id is correct')
    assert.equal(event.content, 'this is the first drug', 'content is correct')
    assert.equal(event.tipAmout, '1000000000000000000', 'tip amount is correct')
    assert.equal(event.author, author, 'author is correct')
     // Check that author received funds
     let newAuthorBalance
     newAuthorBalance = await web3.eth.getBalance(author)
     newAuthorBalance = new web3.utils.BN(newAuthorBalance)
     let tipAmout
      tipAmout = web3.utils.toWei('1', 'Ether')
      tipAmout = new web3.utils.BN(tipAmout)
      const exepectedBalance = oldAuthorBalance.add(tipAmout)

      assert.equal(newAuthorBalance.toString(), exepectedBalance.toString())
      // FAILURE: Tries to tip a post that does not exist
      await dpi.tipdurg(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    } )
})
})

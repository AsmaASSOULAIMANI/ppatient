//import Web3 from 'web3';
App = {
  web3Provider: null,
  contracts: {},
  //account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },
  

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      console.log("inside of elese");
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Dpi.json", function(Dpi) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Dpi = TruffleContract(Dpi);
      // Connect provider to interact with contract
      App.contracts.Dpi.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  /*listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
       instance.votedEvent     ({}, {
         _fromBlock: 0,
        
        
         _toBlock: 'latest',
        
       
      }).watch(function(_error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },*/

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    //web3.eth.getAccounts().then(function(acc) {
      /*contract = await Dpi.deployed();
      account= contract.address;
      ("#accountAddress").html("Your Account: " + account);*/
        //accounts= acc});
        web3.eth.getAccounts(function(err, accounts) {
          if (err === null) {
            var accounte=accounts[0]
            //App.account = account;
            $("#accountAddress").html("Your Account: " + accounte);
          }
        });
        //$("#iname").html("efzhjdlknqzjn" );

      
    //});

    // Load contract data
    App.contracts.Dpi.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.patientCount();
    }).then(function(patientCount) {
      var candidatesResults = $("#candidatesResults");
      //var name= $("#inputEmail4")
      candidatesResults.empty();

     // var candidatesSelect = $('#candidatesSelect');
     // candidatesSelect.empty();

      //for (var i = 1; i <= patientCount; i++) {
        electionInstance.Patients(1).then(function(patient) {
           //var id = patient[0];
           //console.log(patient[0])
           $("#iid").html(1);
           var name = patient[1];
           $("#iname").html(name );
           var pren = patient[2];
           $("#ipren").html(pren );
           var add = patient[3];
           $("#iadd").html(add );
           var tel = patient[4];
           $("#itel").html(tel );
          var date = patient[6];
          $("#idate").html(date);
          var medcin= patient[5];
          $("#idoctor").html(medcin);

          
          // Render candidate Result
          candidatesResults.append(candidateTemplate);


        });
      
    
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
    console.log('elmzq,fsmk,')

  },

  async componentWillMount() {
    await this.loadWeb3()
    console.log('elmzq,fsmk,')
    await this.loadBlockchainData()
  },
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

  },
  constructor(props) {
    //super(props)
    this.state = {
      account: '',
      dpi: null,
      drugCount: 0,
      drugs: [],
      loading: true
    }
    $("#account").html("Your Account: " + this.state.account);

    this.addDrug = this.addDrug.bind(this)
    this.tipdurg = this.tipdursg.bind(this)
  }

    
  
  
  
 
};

$(function() {
  console.log('elmzq,fsmk,')

  $(window).load(function() {
    App.init();
  });
});
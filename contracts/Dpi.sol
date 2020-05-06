pragma solidity >=0.4.21 <0.7.0;
contract Dpi {
    // Model a Candidate
    struct patient {
        uint id;
        string name;
        string prenom;
        string adress;
        string mobile;
        string medcin;
        string date;
    }
    struct drug {
        uint iid;
        string content;
        uint tipAmout;
        address payable author;
    }
    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => patient) public Patients;
    mapping(uint => drug) public drugs;

    // Store Candidates Count
    uint public patientCount;
    uint public drugCount =0;
    event drugAddet(
        uint iid,
        string content,
        uint tipAmout,
        address payable author

    );
    event PostTipped(
        uint id,
        string content,
        uint tipAmout,
        address payable author
    );
    // voted event
    /*event votedEvent (
        uint indexed _candidateId
    );*/

    constructor () public {
        addPatient("ASSOULAIMANI", "Asma","Tilila,Agadir","+212627143955");
    }

    function addPatient (string memory  name,string memory  prenom,
    string memory  adress, string memory  mobile)private {
        patientCount ++;
        Patients[patientCount] = patient(1, name,prenom,adress,mobile,"Mr.X", "le 03/05/2020");
    }

    function addDrug (string memory content) public {
        //require valid content
        require (bytes(content).length > 0, "should have drug");
        drugCount ++;
        //adding a drug ;
        drugs[drugCount] = drug(drugCount,content,0,msg.sender);
        //Trigger event
        emit drugAddet(drugCount,content,0,msg.sender);
    }

    /*function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }*/
    function tipdurg(uint id) public payable {
        // Make sure the id is valid
        require(id > 0 && id <= drugCount, "id enable");
        // Fetch the post
        drug memory druug = drugs[id];
        // Fetch the author
        address payable  authour = druug.author;
        // Pay the author by sending them Ether

       address(uint160(authour)).transfer(msg.value);
        // Incremet the tip amount
        druug.tipAmout = druug.tipAmout + msg.value;
        // Update the post
        drugs[id] = druug;
        // Trigger an event
        emit PostTipped(drugCount, druug.content, druug.tipAmout, authour);
    }
}
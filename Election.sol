// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

contract Election {
    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
        string image;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    constructor () {
        addCandidate("Cat", "QmVwJAvrSaU2yNVawfBPn45N79ETvwmnozdzeEAo2JhP9m");
        addCandidate("Dog", "QmT6DGPA3ScFzFa6ahhR1wceXRVY38bpz6eekWxdjKGDRj");
    }

    function addCandidate (string memory _name, string memory _image) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, _image);
    }

    function vote (uint _candidateId) public {
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
    }
}
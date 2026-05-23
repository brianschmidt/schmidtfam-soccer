// Tournament schedule data — single source of truth.
// time values are minutes-from-midnight for layout math.

window.TOURNAMENT = {
  title: "Memorial Day Weekend",
  subtitle: "Sofia & Max · two venues · solo",
  // pretend "now" is sat 8:35 AM — makes the up-next card show Sofia's 9:15 game
  simulatedNow: { day: 'sat', minute: 8 * 60 + 35 },

  days: [
    {
      id: 'sat',
      label: 'Sat',
      dow: 'Saturday',
      date: 'May 23',
      startHour: 7,
      endHour: 17,
      events: [
        { id:'sat-depart', kind:'travel', lane:'both', start: 7*60, end: 7*60+30,
          title:'Leave for Malvern',
          detail:'Pack everything for both kids — you won\u2019t be at a home base for hours. Cleats, shin guards, both jerseys, water, snacks, Sofia\u2019s gear too.' },
        { id:'sat-drop', kind:'travel', lane:'max', start: 7*60+30, end: 8*60,
          title:'Drop Max at GCVSA',
          detail:'Hand Max off to Simon / a 2012 Boys family. Confirm someone watches him after his game until you\u2019re back.' },
        { id:'sat-max1', kind:'game', lane:'max', start: 8*60, end: 9*60+15,
          who:'Max', game:'Game 1', attending:false,
          opponent:'BWP Albany Football Academy', age:'U14 · 2012s',
          venue:'GCVSA Line Road', field:'Field 3',
          addr:'137 Line Road, Malvern, PA',
          note:'You will not be there \u2014 check in with Simon for the result.' },
        { id:'sat-sof1', kind:'game', lane:'sofia', start: 9*60+15, end: 10*60+45,
          who:'Sofia', game:'Game 1', attending:true,
          opponent:"FC DELCO Black Conshy '14", age:'9v9 · G14s',
          venue:'United Sports', field:'Field 01B',
          addr:'1426 Marshallton Thorndale Rd, Downingtown, PA',
          note:'Arrive ~8:30 AM for warm-up.' },
        { id:'sat-travel1', kind:'travel', lane:'both', start: 10*60+45, end: 11*60+15,
          title:'Downingtown \u2192 Malvern',
          detail:'Drive back to GCVSA, arrive ~11:05. Grab lunch with both kids near the Malvern complex before Max\u2019s 1 PM game.',
          drive:20 },
        { id:'sat-max2', kind:'game', lane:'max', start: 13*60, end: 14*60+15,
          who:'Max', game:'Game 2', attending:true,
          opponent:'STA MOSC 2012 EDP Boys', age:'U14 · 2012s',
          venue:'GCVSA Line Road', field:'Field 4',
          addr:'137 Line Road, Malvern, PA' },
        { id:'sat-travel2', kind:'travel', lane:'both', start: 14*60+30, end: 14*60+55,
          title:'Malvern \u2192 Downingtown',
          detail:'Tight but workable. Leave by 2:35 to arrive United Sports by ~2:55 PM.',
          drive:20 },
        { id:'sat-sof2', kind:'game', lane:'sofia', start: 15*60+30, end: 17*60,
          who:'Sofia', game:'Game 2', attending:true,
          opponent:'South Parkland Youth Phoenix 2014', age:'9v9 · G14s',
          venue:'United Sports', field:'Field 02B',
          addr:'1426 Marshallton Thorndale Rd, Downingtown, PA' },
      ],
      conflicts: [
        { start: 8*60, end: 9*60+15, label:'You can\u2019t be at both' }
      ],
      // a single critical action item we surface heavily
      heroAction: {
        title:'Saturday morning handoff',
        body:'Max\u2019s 8 AM in Malvern overlaps Sofia\u2019s 9:15 in Downingtown. Drop Max with Simon\u2019s family by 7:30, drive to Sofia, be back at GCVSA by ~11:05 for lunch + Game 2.',
        steps:[
          'Text Simon tonight \u2014 confirm watcher between Max\u2019s Game 1 and 2',
          'Drop Max at GCVSA 7:30 AM',
          'Leave for Downingtown immediately, target Sofia warm-up 8:30',
          'Back at GCVSA ~11:05 for lunch with both kids'
        ]
      }
    },
    {
      id: 'sun',
      label: 'Sun',
      dow: 'Sunday',
      date: 'May 24',
      startHour: 8,
      endHour: 14,
      events: [
        { id:'sun-depart', kind:'travel', lane:'both', start: 8*60+15, end: 8*60+45,
          title:'Leave for Malvern',
          detail:'Target arrival 8:30 AM at GCVSA for warm-up.' },
        { id:'sun-max3', kind:'game', lane:'max', start: 9*60+15, end: 10*60+30,
          who:'Max', game:'Game 3', attending:true,
          opponent:'LVU Rush ECNL-RL B12', age:'U14 · 2012s',
          venue:'GCVSA Line Road', field:'Field 4',
          addr:'137 Line Road, Malvern, PA' },
        { id:'sun-travel', kind:'travel', lane:'both', start: 10*60+45, end: 11*60+15,
          title:'Malvern \u2192 Downingtown',
          detail:'Comfortable window \u2014 arrive United Sports ~11:05 AM.',
          drive:20 },
        { id:'sun-sof3', kind:'game', lane:'sofia', start: 11*60+45, end: 13*60+15,
          who:'Sofia', game:'Game 3', attending:true,
          opponent:'Manhattan SC Arsenal White 2014', age:'9v9 · G14s',
          venue:'United Sports', field:'Dome 02A',
          indoor:true,
          addr:'1426 Marshallton Thorndale Rd, Downingtown, PA',
          note:'Indoor dome \u2014 turf shoes recommended.' },
      ],
      conflicts: [],
      heroAction: null
    }
  ],

  venues: [
    { id:'us', name:'United Sports Training Center', for:'sofia',
      addr:'1426 Marshallton Thorndale Rd, Downingtown, PA 19335',
      slots:[
        { day:'Sat', time:'9:15 AM', field:'Field 01B' },
        { day:'Sat', time:'3:30 PM', field:'Field 02B' },
        { day:'Sun', time:'11:45 AM', field:'Dome 02A (indoor)' },
      ]},
    { id:'gcvsa', name:'GCVSA Line Road Complex', for:'max',
      addr:'137 Line Road, Malvern, PA 19355',
      slots:[
        { day:'Sat', time:'8:00 AM', field:'Field 3' },
        { day:'Sat', time:'1:00 PM', field:'Field 4' },
        { day:'Sun', time:'9:15 AM', field:'Field 4' },
      ]}
  ],

  driveNote:'United Sports \u2194 GCVSA: ~20 min · 8\u201310 mi via PA-3 / Strasburg Rd. Memorial Day weekend traffic is usually light \u2014 pad 5\u201310 min for venue parking.',

  packing: [
    { group:'Uniform', items:['Home + away jerseys, shorts, socks (\u00d72 kids)','Cleats','Indoor / turf shoes (Sun dome)','Shin guards, mouthguards, headbands'] },
    { group:'Fuel', items:['Multiple water bottles + electrolyte mix','Fruit, bagels, granola bars, pretzels','Small cooler'] },
    { group:'Comfort', items:['Folding chairs, blanket','Sunscreen + hats','Rain gear / extra layers','Phone chargers / portable battery'] },
    { group:'Just-in-case', items:['KT tape, band-aids, ibuprofen, ice packs','Cash for parking / concessions','This plan + the printed schedule'] },
  ],

  openItems: [
    { who:'Ben (Sofia\u2019s coach)', what:'Will send meeting times + arrival details for the 2014 Girls.' },
    { who:'Simon (Max\u2019s coach)', what:'Same for the 2012 Boys \u2014 meeting may be earlier than 7:15 AM.' },
    { who:'You', what:'Confirm warm-up conventions with both coaches \u2014 plan assumes ~45 min pre-game.' },
  ],
};

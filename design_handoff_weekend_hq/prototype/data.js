// Tournament schedule data — single source of truth.
// time values are minutes-from-midnight for layout math.

window.TOURNAMENT = {
  title: "Memorial Day Weekend",
  subtitle: "Sofia & Max · two venues + a hotel · solo",
  // pretend "now" is Sat 8:35 AM — Up Next shows Sofia's 9:15 game (whole family)
  simulatedNow: { day: 'sat', minute: 8 * 60 + 35 },

  days: [
    {
      id: 'sat',
      label: 'Sat',
      dow: 'Saturday',
      date: 'May 23',
      startHour: 7,
      endHour: 21,
      events: [
        { id:'sat-depart', kind:'travel', lane:'both', start: 8*60, end: 8*60+30,
          title:'Leave hotel for Downingtown',
          detail:'Sofia plays first today, so the whole crew heads to United Sports. Pack everything for both kids \u2014 you\u2019re out all day. ~25\u201330 min drive; leave by 8:00 to make Sofia\u2019s ~8:30 warm-up.',
          drive: 28 },
        { id:'sat-sof1', kind:'game', lane:'sofia', start: 9*60+15, end: 10*60+45,
          who:'Sofia', game:'Game 1', attending:true,
          opponent:"FC DELCO Black Conshy '14", age:'9v9 \u00b7 G14s',
          venue:'United Sports', field:'Field 01B',
          addr:'1426 Marshallton Thorndale Rd, Downingtown, PA',
          note:'Arrive ~8:30 AM for warm-up. Whole family\u2019s here \u2014 Max\u2019s first game isn\u2019t until 11:45.' },
        { id:'sat-travel1', kind:'travel', lane:'both', start: 10*60+45, end: 11*60,
          title:'Downingtown \u2192 West Chester',
          detail:'Drive to Bayard Rustin for Max\u2019s 11:45 game \u2014 aim to arrive by ~11:00 (45 min before kickoff).',
          drive: 15 },
        { id:'sat-max1', kind:'game', lane:'max', start: 11*60+45, end: 13*60+15,
          who:'Max', game:'Game 1', attending:true,
          opponent:'Sporting Athletic Club 2012 NAL', age:'U14 \u00b7 2012s',
          venue:'Bayard Rustin HS', field:'Field 4',
          addr:'1100 Shiloh Road, West Chester, PA',
          note:'Arrive ~11:00 \u2014 team wants him there 45 min early.' },
        { id:'sat-break', kind:'travel', lane:'both', start: 13*60+15, end: 15*60,
          title:'Midday break \u2014 lunch + regroup',
          detail:'A few hours until the afternoon split. Sofia\u2019s 3:30 in Downingtown, Max\u2019s 4:45 in West Chester. Time to lock in the ride for whichever kid you\u2019re not with.' },
        // Afternoon: parent on Max's track. Sofia G2 not attended.
        { id:'sat-sof2', kind:'game', lane:'sofia', start: 15*60+30, end: 17*60,
          who:'Sofia', game:'Game 2', attending:false,
          opponent:'South Parkland Youth Phoenix 2014', age:'9v9 \u00b7 G14s',
          venue:'United Sports', field:'Field 02B',
          addr:'1426 Marshallton Thorndale Rd, Downingtown, PA',
          note:'Overlaps Max\u2019s 4:45 \u2014 a teammate\u2019s family needs to cover this one.' },
        { id:'sat-max2', kind:'game', lane:'max', start: 16*60+45, end: 18*60+15,
          who:'Max', game:'Game 2', attending:true,
          opponent:'East Coast Surf B2012 EDP', age:'U14 \u00b7 2012s',
          venue:'Bayard Rustin HS', field:'Field 4',
          addr:'1100 Shiloh Road, West Chester, PA',
          note:'Arrive 4:00 (45 min early).' },
        // Evening dinners — Sofia not attended, Max attended
        { id:'sat-sof-dinner', kind:'dinner', lane:'sofia', start: 19*60, end: 20*60+30,
          who:'Sofia', label:'Team dinner', attending:false,
          opponent:'2014 Girls team dinner', age:'G14s \u00b7 Team dinner',
          venue:"LaScala's FIRE", field:'Villanova',
          addr:'789 E Lancaster Ave, Villanova, PA 19085',
          note:'Sofia needs a ride from her 3:30 game through this dinner \u2014 ideally a teammate\u2019s family covers the whole afternoon + evening.' },
        { id:'sat-max-dinner', kind:'dinner', lane:'max', start: 19*60+15, end: 20*60+45,
          who:'Max', label:'Team dinner', attending:true,
          opponent:'2012 Boys team dinner', age:'U14 \u00b7 Team dinner',
          venue:"Will's + Bill's", field:'Berwyn',
          addr:'324 Swedesford Rd, Berwyn, PA 19312',
          note:'Comfortable gap after Max\u2019s 4:45 game (~6:15 end) before the 7:15 dinner. Berwyn is ~20 min from West Chester.' },
      ],
      // One continuous "one track only" window for the afternoon + evening.
      conflicts: [
        { start: 15*60+30, end: 20*60+45, label:'One track only' }
      ],
      heroActions: [
        {
          id:'sat-track',
          title:'Saturday afternoon \u2014 pick one kid\u2019s track',
          tone:'warn',
          body:'From 3:30 PM on, Sofia (Downingtown) and Max (West Chester) split. Current plan: you ride Max\u2019s track \u2014 his 4:45 game, then his 7:15 dinner in Berwyn. A 2014 Girls teammate\u2019s family covers Sofia\u2019s 3:30 game and brings her to her 7:00 dinner in Villanova.',
          steps:[
            'Lock in the ride/handoff for Sofia from 3:30 game through Villanova dinner',
            'Check: are dinners drop-off, or are parents expected to stay?',
            'Sort out who picks each kid up after dinner, and when',
            'Flip the whole plan if you\u2019d rather be on Sofia\u2019s track instead'
          ]
        }
      ]
    },
    {
      id: 'sun',
      label: 'Sun',
      dow: 'Sunday',
      date: 'May 24',
      startHour: 7,
      endHour: 14,
      events: [
        { id:'sun-checkout', kind:'travel', lane:'both', start: 7*60+30, end: 7*60+55,
          title:'Check out of The Prussia Hotel',
          detail:'Load the car with everything \u2014 you go straight from Max\u2019s game to Sofia\u2019s and then home.' },
        { id:'sun-depart', kind:'travel', lane:'both', start: 7*60+55, end: 8*60+30,
          title:'Hotel \u2192 West Chester',
          detail:'Target Bayard Rustin by 8:30 AM \u2014 45 min before Max\u2019s 9:15 game. ~25 min via US-202 S.',
          drive: 25 },
        { id:'sun-max3', kind:'game', lane:'max', start: 9*60+15, end: 10*60+45,
          who:'Max', game:'Game 3', attending:true,
          opponent:'Syracuse Development Academy 2012 MLS Next AD', age:'U14 \u00b7 2012s',
          venue:'Bayard Rustin HS', field:'Field 4',
          addr:'1100 Shiloh Road, West Chester, PA' },
        { id:'sun-travel', kind:'travel', lane:'both', start: 10*60+45, end: 11*60,
          title:'West Chester \u2192 Downingtown',
          detail:'Comfortable window to reach United Sports for Sofia\u2019s 11:45 game \u2014 arrive by ~11:00.',
          drive: 15 },
        { id:'sun-sof3', kind:'game', lane:'sofia', start: 11*60+45, end: 13*60+15,
          who:'Sofia', game:'Game 3', attending:true,
          opponent:'Manhattan SC Arsenal White 2014', age:'9v9 \u00b7 G14s',
          venue:'United Sports', field:'Dome 02A',
          indoor:true,
          addr:'1426 Marshallton Thorndale Rd, Downingtown, PA',
          note:'Indoor dome \u2014 turf shoes recommended.' },
      ],
      conflicts: [],
      heroActions: []
    }
  ],

  venues: [
    { id:'hotel', name:'The Prussia Hotel', for:'hotel',
      tag:'home base',
      addr:'131 South Gulph Road, King of Prussia, PA 19406',
      slots:[
        { day:'Sat', time:'AM',  field:'Depart ~8:00 \u2192 Downingtown' },
        { day:'Sun', time:'AM',  field:'Check out ~7:30 \u2192 West Chester' },
      ],
      meta:'Marriott Bonvoy \u00b7 ~25 min to either venue' },
    { id:'us', name:'United Sports Training Center', for:'sofia',
      addr:'1426 Marshallton Thorndale Rd, Downingtown, PA 19335',
      slots:[
        { day:'Sat', time:'9:15 AM',  field:'Field 01B' },
        { day:'Sat', time:'3:30 PM',  field:'Field 02B' },
        { day:'Sun', time:'11:45 AM', field:'Dome 02A (indoor)' },
      ]},
    { id:'bayard', name:'Bayard Rustin HS', for:'max',
      addr:'1100 Shiloh Road, West Chester, PA 19382',
      slots:[
        { day:'Sat', time:'11:45 AM', field:'Field 4' },
        { day:'Sat', time:'4:45 PM',  field:'Field 4' },
        { day:'Sun', time:'9:15 AM',  field:'Field 4' },
      ]},
  ],

  driveRoutes: [
    { from:'Prussia Hotel',  to:'United Sports (Downingtown)', mins:'25\u201330', miles:'~21 mi' },
    { from:'Prussia Hotel',  to:'Bayard Rustin (West Chester)', mins:'25',     miles:'~19 mi \u00b7 US-202 S' },
    { from:'United Sports',  to:'Bayard Rustin',                mins:'15',     miles:'~7 mi' },
  ],
  driveNote:'Memorial Day weekend should mean light commuter traffic, but tournament-day venue congestion can add 5\u201310 min for parking. Pad accordingly.',

  packing: [
    { group:'Uniform', items:['Home + away jerseys, shorts, socks (\u00d72 kids)','Cleats','Indoor / turf shoes (Sun dome)','Shin guards, mouthguards, headbands'] },
    { group:'Fuel', items:['Multiple water bottles + electrolyte mix','Fruit, bagels, granola bars, pretzels','Small cooler'] },
    { group:'Comfort', items:['Folding chairs, blanket','Sunscreen + hats','Rain gear / extra layers','Phone chargers / portable battery'] },
    { group:'Just-in-case', items:['KT tape, band-aids, ibuprofen, ice packs','Cash for parking / concessions','This plan + the printed schedule'] },
  ],

  openItems: [
    // Asks — decisions you need to make / calls to place
    { kind:'ask', who:'Saturday afternoon split',  what:'Decide which kid you\u2019ll be with and line up a teammate\u2019s family to cover the other. Current plan: you\u2019re on Max\u2019s track.' },
    { kind:'ask', who:'Sofia\u2019s ride',           what:'Confirm a 2014 Girls family can carry Sofia from her 3:30 game through her 7:00 dinner at LaScala\u2019s FIRE in Villanova.' },
    { kind:'ask', who:'Dinners \u2014 drop-off?',    what:'Are the team dinners drop-off, or are parents expected to stay? Decides the rest of the evening.' },
    { kind:'ask', who:'Dinner pickups',            what:'Sort out who picks up each kid after their dinner, and roughly when.' },
    { kind:'ask', who:'Warm-up conventions',       what:'Confirm ~45 min pre-game arrival with both coaches \u2014 plan assumes this.' },
    // FYI — waiting on others
    { kind:'fyi', who:'Ben (Sofia\u2019s coach)',    what:'Will send meeting times + arrival details for the 2014 Girls. Watch for the email.' },
    { kind:'fyi', who:'Simon (Max\u2019s coach)',    what:'Max\u2019s team arrives 45 min before kickoff: 11:00 + 4:00 Sat, 8:30 Sun. Watch for any \u201cearlier\u201d note.' },
  ],
};

/* RAM&A 2026 — schedule data. This is the ONLY file to edit when the programme is finalised.

   1) KEYNOTES: set each slot to a speaker id from keynoteSpeakers, e.g.  "22-1": "sanjeev-singh"
      (slot "22-1" = Tue 22 Dec, Keynote 1). Name, affiliation, talk title and photo come from keynoteSpeakers.
      A speaker's talk title can be edited in keynoteSpeakers[...].talk (also add .abstract if wanted).

   2) ROOMS: rooms: { "ms1": "Room 101, Block 8", ... }

   3) TALKS: talks["ms1"]["22-pm"] = [ { speaker: "Dr. A. Name", affil: "University", title: "Talk title" }, ... ]
      One entry per talk, in order. Block ids: 22-pm, 22-on, 23-am, 23-pm, 23-on, 24-am, 24-pm
      (on = online block, am/pm = offline). Symposium ids: ms1 … ms11 (same order as the Symposiums page).
      Anything left empty shows "to be announced". */
window.RAMA_DATA = {
 "symposia": [
  {
   "id": "ms1",
   "no": 1,
   "title": "Advanced Numerical and Data-Driven Methods for Differential Equations",
   "conveners": [
    "Dr. Sachin Sharma"
   ]
  },
  {
   "id": "ms2",
   "no": 2,
   "title": "Algebra, Number theory and Analysis",
   "conveners": [
    "Dr. Rishabh Agnihotri",
    "Dr. Naveen Gupta"
   ]
  },
  {
   "id": "ms3",
   "no": 3,
   "title": "Modeling dynamics and AI-driven approach in Epidemiology, Eco-Epidemiology, and Ecology",
   "conveners": [
    "Dr. Rajanish Kumar Rai"
   ]
  },
  {
   "id": "ms4",
   "no": 4,
   "title": "Probabilistic Modeling, Analytics, and Intelligent Systems",
   "conveners": [
    "Dr. Anupam",
    "Dr. Shruti"
   ]
  },
  {
   "id": "ms5",
   "no": 5,
   "title": "Shock Waves, Vibrations and Numerical Methods: Mathematical and Engineering Perspectives",
   "conveners": [
    "Dr. Deepika Singh",
    "Dr. Rashmi Rani"
   ]
  },
  {
   "id": "ms6",
   "no": 6,
   "title": "Frontiers in Operator Theory and Functional Analysis",
   "conveners": [
    "Dr. Bhawna Gupta",
    "Dr. Shivam Kumar Singh"
   ]
  },
  {
   "id": "ms7",
   "no": 7,
   "title": "Information Security and Emerging Technologies: Mathematical Models, Cryptography, and AI-Driven Defence",
   "conveners": [
    "Dr. Ankur Gupta",
    "Dr. Rashmi Chaudhry"
   ]
  },
  {
   "id": "ms8",
   "no": 8,
   "title": "Universal Flows: Accelerating Cosmological and Multiphase CFD with Artificial Intelligence",
   "conveners": [
    "Dr. Sumit Malik",
    "Dr. Shaily Tyagi"
   ]
  },
  {
   "id": "ms9",
   "no": 9,
   "title": "Optimization theory and its applications in science & engineering",
   "conveners": [
    "Dr. Bharti Sharma",
    "Dr. Arvind Kumar"
   ]
  },
  {
   "id": "ms10",
   "no": 10,
   "title": "Fractional Dynamics, Special Functions, and Advanced Computational Methods in Mathematical Modeling",
   "conveners": [
    "Dr. Shubham Jaiswal",
    "Dr. Shyamsunder"
   ]
  },
  {
   "id": "ms11",
   "no": 11,
   "title": "Multiscale Nonlinear Dynamics: Fractional, Fractal, and Magnetic Models in Computational Mathematics",
   "conveners": [
    "Dr. Madhukant Sharma",
    "Dr. Sharad Dwivedi"
   ]
  }
 ],
 "blocks": {
  "22-pm": {
   "day": "22",
   "date": "Tue 22 Dec",
   "start": "14:00",
   "end": "16:00",
   "n": 6,
   "mode": "offline"
  },
  "22-on": {
   "day": "22",
   "date": "Tue 22 Dec",
   "start": "16:15",
   "end": "18:15",
   "n": 6,
   "mode": "online"
  },
  "23-am": {
   "day": "23",
   "date": "Wed 23 Dec",
   "start": "09:30",
   "end": "11:15",
   "n": 5,
   "mode": "offline"
  },
  "23-pm": {
   "day": "23",
   "date": "Wed 23 Dec",
   "start": "14:00",
   "end": "16:00",
   "n": 6,
   "mode": "offline"
  },
  "23-on": {
   "day": "23",
   "date": "Wed 23 Dec",
   "start": "16:15",
   "end": "18:15",
   "n": 6,
   "mode": "online"
  },
  "24-am": {
   "day": "24",
   "date": "Thu 24 Dec",
   "start": "09:30",
   "end": "11:15",
   "n": 5,
   "mode": "offline"
  },
  "24-pm": {
   "day": "24",
   "date": "Thu 24 Dec",
   "start": "14:00",
   "end": "15:30",
   "n": 5,
   "mode": "offline"
  }
 },
 "keynoteSlots": {
  "22-1": null,
  "22-2": null,
  "22-3": null,
  "23-1": null,
  "23-2": null,
  "23-3": null,
  "24-1": null,
  "24-2": null,
  "24-3": null
 },
 "keynoteTimes": {
  "1": [
   "11:30",
   "12:10"
  ],
  "2": [
   "12:10",
   "12:50"
  ],
  "3": [
   "12:50",
   "13:30"
  ]
 },
 "keynoteSpeakers": {
  "zhilin-li": {
   "name": "Prof. Zhilin Li",
   "affil": "North Carolina State University",
   "talk": "Numerical analysis",
   "photo": "zhilin-li.jpg",
   "url": "https://zhilin.math.ncsu.edu"
  },
  "naim-latif-braha": {
   "name": "Prof. Naim Latif Braha",
   "affil": "University of Prishtina, Kosovo",
   "talk": "Approximate Theory, Polynomial Operators and Applications",
   "photo": "naim-latif-braha.jpg",
   "url": "https://www.researchgate.net/profile/Naim-Braha-2"
  },
  "ana-maria-acu": {
   "name": "Prof. Ana Maria Acu",
   "affil": "Lucian Blaga University of Sibiu, Romania",
   "talk": "Approximation Theory",
   "photo": "ana-maria-acu.jpg",
   "url": "https://scholar.google.com/citations?user=Q3ssLvUAAAAJ&amp;hl=ro"
  },
  "sandeep-kumar-shukla": {
   "name": "Prof. Sandeep Kumar Shukla",
   "affil": "Director, IIIT Hyderabad",
   "talk": "Cyber Security, Embedded Systems",
   "photo": "sandeep-kumar-shukla.jpg",
   "url": "https://www.iiit.ac.in/faculty/sandeep-kumar-shukla/"
  },
  "sanjeev-kumar-msdu": {
   "name": "Prof. Sanjeev Kumar",
   "affil": "Vice Chancellor, MSD University, Azamgarh",
   "talk": "Mathematical Modeling and Fuzzy Modeling",
   "photo": "sanjeev-kumar-msdu.jpg",
   "url": "https://msdu.ac.in/administration/vice-chancellor"
  },
  "ram-jiwari": {
   "name": "Prof. Ram Jiwari",
   "affil": "IIT Roorkee",
   "talk": "Numerical Analysis and Wavelet Analysis",
   "photo": "ram-jiwari.jpg",
   "url": "https://iitr.ac.in/Departments/Mathematics%20Department/People/Faculty/100664.html"
  },
  "sanjeev-malik": {
   "name": "Prof. Sanjeev Kumar",
   "affil": "IIT Roorkee",
   "talk": "Machine Learning",
   "photo": "sanjeev-malik.jpg",
   "url": "https://www.iitr.ac.in/~MA/Malikfma"
  },
  "rajesh-pandey": {
   "name": "Prof. Rajesh Pandey",
   "affil": "IIT BHU",
   "talk": "Numerical Analysis and Fractional PDEs",
   "photo": "rajesh-pandey.jpg",
   "url": "https://iitbhu.ac.in/dept/mat/people/rkpandeymat"
  },
  "dharmraja": {
   "name": "Prof. S. Dharmraja",
   "affil": "IIT Delhi",
   "talk": "Stochastic Modeling, Statistical Data Analysis",
   "photo": "dharmraja.jpg",
   "url": "https://web.iitd.ac.in/~dharmar/"
  },
  "mahesh-c-joshi": {
   "name": "Prof. Mahesh C. Joshi",
   "affil": "Kumaun University, DSB Campus, Nainital, Uttarakhand",
   "talk": "Geometry and Topology",
   "photo": "mahesh-c-joshi.jpg",
   "url": "https://www.kunainital.ac.in/faculties/faculty-of-science/mathematics-department"
  },
  "cp-singh": {
   "name": "Prof. C. P. Singh",
   "affil": "Delhi Technological University",
   "talk": "General Relativity and Cosmology",
   "photo": "cp-singh.jpg",
   "url": "https://dtu.ac.in/modules/faculty_profile_new/faculty_index.php?uname=cpsingh"
  },
  "sanjeev-singh": {
   "name": "Dr. Sanjeev Singh",
   "affil": "IIT Indore",
   "talk": "Special Functions",
   "photo": "sanjeev-singh.jpg",
   "url": "https://people.iiti.ac.in/~snjvsngh/"
  },
  "nk-tomar": {
   "name": "Dr. N. K. Tomar",
   "affil": "IIT Patna",
   "talk": "Mathematical Control Theory",
   "photo": "nk-tomar.jpg",
   "url": "https://scholar.google.co.in/citations?user=WHEUGkYAAAAJ&amp;hl=en"
  },
  "prashant-srivastava": {
   "name": "Dr. Prashant Srivastava",
   "affil": "IIT Patna",
   "talk": "Mathematical Modeling in Biological systems and Nonlinear Dynamics",
   "photo": "prashant-srivastava.jpg",
   "url": "https://www.iitp.ac.in/~pksri/"
  }
 }
};
window.RAMA_DATA.rooms = {};
window.RAMA_DATA.talks = {};

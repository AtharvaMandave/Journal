'use client'
import { useState } from 'react';
import { Search, Mail, MapPin, GraduationCap, Building2, Globe, Filter, X } from 'lucide-react';

export default function EditorialBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Dummy data - replace with backend API call later
  const editorialMembers = [
    {
      id: 1,
      name: "Dr. Sudhir Kumar Jain",
      title: "Deputy Director And Associate Professor",
      department: "Department Of Botany and Microbiology",
      institution: "Vikram University, Ujjain, M.P. (India)",
      country: "India",
      email: "sudhir.jain@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 2,
      name: "Mr. Hrituraj Singh Rathore",
      title: "Managing Editor",
      department: "International Research Journal Of Modernization In Engineering Technology And Science",
      institution: "LNMSDD, INDIA",
      country: "India",
      email: "editor@irjmets.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 3,
      name: "Dr. M. Deepalakshmi",
      title: "Assistant Professor",
      department: "Department Of Commerce",
      institution: "PSGR Krishnammal College for Women, Peelamedu, Senganalur, INDIA",
      country: "India",
      email: "deepa.m@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 4,
      name: "Dr. D.K. Sakravdia",
      title: "Head of Department",
      department: "Department of Electrical Engineering",
      institution: "Ujjain Engineering College, Ujjain, India",
      country: "India",
      email: "dk.sakravdia@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 5,
      name: "Dr. S.K. Jain",
      title: "Former Registrar, Professor",
      department: "Department of Mathematics",
      institution: "Ujjain Engineering College, Ujjain, INDIA",
      country: "India",
      email: "sk.jain@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 6,
      name: "Dr. Umesh Kumar Singh",
      title: "Director and Professor",
      department: "Dept. Of Computer Science",
      institution: "School of Engineering and Technology, Vikram University, Ujjain, India",
      country: "India",
      email: "umesh.singh@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 7,
      name: "Dr. A.V. Raghu",
      title: "Professor",
      department: "Department of Chemistry",
      institution: "Center for Emerging Technology, Jain Global Campus, Jain University, INDIA",
      country: "India",
      email: "av.raghu@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 8,
      name: "Dr. Hasan KÖten",
      title: "Assistant Professor",
      department: "Head of Mechanical Engineering Department",
      institution: "Istanbul Medeniyet University, Istanbul",
      country: "Turkey",
      email: "hasan.koten@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 9,
      name: "Dr. Savita Maru",
      title: "Professor",
      department: "Department of Civil Engineering",
      institution: "Dean of Planning, Ujjain Engineering College, Ujjain, INDIA",
      country: "India",
      email: "savita.maru@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 10,
      name: "Dr. Alireza Heidari",
      title: "Professor & Director",
      department: "The BioSpectroscopy Core Research Laboratory",
      institution: "At Faculty of Chemistry, California South University, California, USA",
      country: "USA",
      email: "alireza.heidari@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 11,
      name: "Ts. Dr. Chew Xinying",
      title: "Senior Lecturer",
      department: "School of Computer Science",
      institution: "Universiti Sains Malaysia, Malaysia",
      country: "Malaysia",
      email: "chew.xinying@example.com",
      image: "/api/placeholder/120/120"
    },
    {
      id: 12,
      name: "Dr. Shinemin Lin",
      title: "Professor",
      department: "Department of Mathematics",
      institution: "Savannah State University, Savannah, Georgia",
      country: "USA",
      email: "shinemin.lin@example.com",
      image: "/api/placeholder/120/120"
    }
  ];

  const countries = ['All', ...new Set(editorialMembers.map(m => m.country))];
  const departments = ['All', 'Computer Science', 'Engineering', 'Mathematics', 'Chemistry', 'Commerce'];

  const filteredMembers = editorialMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || member.country === selectedCountry;
    const matchesDepartment = selectedDepartment === 'All' || 
                              member.department.toLowerCase().includes(selectedDepartment.toLowerCase());
    
    return matchesSearch && matchesCountry && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-16 h-16 mr-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Editorial Board
          </h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            Meet our distinguished panel of experts from leading institutions worldwide
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Globe className="w-4 h-4" />
              <span>{countries.length - 1} Countries</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Building2 className="w-4 h-4" />
              <span>{editorialMembers.length} Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, department..."
                className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Country Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCountry !== 'All' || selectedDepartment !== 'All') && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  Search: {searchTerm}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                </span>
              )}
              {selectedCountry !== 'All' && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {selectedCountry}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCountry('All')} />
                </span>
              )}
              {selectedDepartment !== 'All' && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {selectedDepartment}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDepartment('All')} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <p className="text-gray-600 text-sm">
          Showing <span className="font-semibold text-blue-600">{filteredMembers.length}</span> of {editorialMembers.length} members
        </p>
      </div>

      {/* Editorial Members Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {member.title}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {member.department}
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {member.institution}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {member.country}
                    </span>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group-hover:shadow-lg"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('All');
                setSelectedDepartment('All');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <p className="text-center text-gray-700 leading-relaxed">
            Our editorial board comprises distinguished scholars and researchers from leading institutions across the globe. 
            Each member brings unique expertise and insights to ensure the highest standards of academic excellence.
          </p>
        </div>
      </div>
    </div>
  );
}
import { FaUsers, FaEnvelope, FaPhone, FaUserCircle, FaFileAlt, FaFirstAid } from 'react-icons/fa'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNurse } from '../../context/NurseContext'
import { getStats } from '../../services/statsService'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './styles.css'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Dashboard = () => {
  const [date, setDate] = useState(new Date())
  const navigate = useNavigate()
  const { nurseDetails, loading, error } = useNurse();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    totalInfirmaryVisits: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        console.log('Raw API Response:', response);
        
        // Since api.js already returns the data part, we can access the stats directly
        const statsData = response.data;
        console.log('Stats data:', statsData);
        
        const updatedStats = {
          totalStudents: statsData.students || 0,
          totalAssessments: statsData.assessments || 0,
          totalInfirmaryVisits: statsData.infirmaries || 0,
          isLoading: false,
          error: null
        };
        
        console.log('Setting stats to:', updatedStats);
        setStats(updatedStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Failed to load statistics'
        }));
      }
    };

    fetchStats();
  }, []);

  // Add console log to track stats updates
  useEffect(() => {
    console.log('Current stats state:', stats);
  }, [stats]);

  // Sample events - replace with your actual events data
  const events = [
    {
      title: 'Health Assessment - Class 6A',
      start: new Date(2025, 2, 13, 11, 0),
      end: new Date(2025, 2, 13, 12, 0),
      allDay: false
    },
    {
      title: 'Dental Check - Class 7B',
      start: new Date(2025, 2, 14, 10, 30),
      end: new Date(2025, 2, 14, 11, 30),
      allDay: false
    },
    {
      title: 'Vision Test - Class 8A',
      start: new Date(2025, 2, 14, 15, 0),
      end: new Date(2025, 2, 14, 16, 0),
      allDay: false
    },
    {
      title: 'Physical Fitness - Class 9C',
      start: new Date(2025, 2, 15, 14, 30),
      end: new Date(2025, 2, 15, 15, 30),
      allDay: false
    },
    {
      title: 'Nutrition Workshop - Class 10A',
      start: new Date(2025, 2, 16, 9, 0),
      end: new Date(2025, 2, 16, 10, 0),
      allDay: false
    },
    {
      title: 'Mental Health Session - Class 11B',
      start: new Date(2025, 2, 17, 13, 0),
      end: new Date(2025, 2, 17, 14, 0),
      allDay: false
    }
  ]

  // Calendar event handlers
  const handleNavigate = (newDate) => setDate(newDate)

  // Stats data configuration
  const statsConfig = [
    { 
      name: 'My Students', 
      count: stats.totalStudents, 
      icon: FaUsers, 
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      onClick: () => navigate('/ahana/first-school/students')
    },
    { 
      name: 'Assessment Reports', 
      count: stats.totalAssessments, 
      icon: FaFileAlt, 
      gradient: 'bg-gradient-to-br from-green-500 to-green-700',
      onClick: () => navigate('/ahana/first-school/assessments')
    },
    { 
      name: 'Infirmary Reports', 
      count: stats.totalInfirmaryVisits, 
      icon: FaFirstAid, 
      gradient: 'bg-gradient-to-br from-red-500 to-red-700',
      onClick: () => navigate('/ahana/first-school/infirmary')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Welcome Card with Glassmorphism */}
      <div className="relative mb-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <div className="flex items-center gap-8">
            <div className="shrink-0 bg-gradient-to-br from-white/20 to-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
              {nurseDetails?.profilePic ? (
                <img 
                  src={nurseDetails.profilePic} 
                  alt={nurseDetails.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 text-white/90" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-white tracking-tight">
                    {nurseDetails?.name || 'Nurse'}
                  </h1>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                    {nurseDetails?.nurseId}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-white/90 hover:text-white transition-colors group">
                    <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
                      <FaEnvelope className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium tracking-wide">{nurseDetails?.email}</span>
                  </div>
                  <div className="flex items-center text-white/90 hover:text-white transition-colors group">
                    <div className="bg-white/10 p-3 rounded-xl mr-4 group-hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
                      <FaPhone className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-medium tracking-wide">{nurseDetails?.phone}</span>
                  </div>
                </div>
                {nurseDetails?.languagesSpoken && nurseDetails.languagesSpoken.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {nurseDetails.languagesSpoken.map((language, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 text-white rounded-full text-sm"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsConfig.map((item) => (
          <div
            key={item.name}
            className={`${item.gradient} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover:brightness-110 cursor-pointer relative`}
            onClick={item.onClick}
          >
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-3 rounded-lg shadow-lg backdrop-blur-sm">
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-white">
                      {stats.isLoading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-20 rounded"></div>
                      ) : (
                        item.count.toLocaleString()
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-white/90 hover:text-white">
                    <span className="flex items-center">
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {stats.error && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-xs p-1 text-center">
                Failed to load data
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Schedule Calendar</h3>
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={Views.MONTH}
            view={Views.MONTH}
            views={[Views.MONTH]}
            date={date}
            onNavigate={handleNavigate}
            min={new Date(2024, 0, 1, 8, 0)} // 8:00 AM
            max={new Date(2024, 0, 1, 20, 0)} // 8:00 PM
            popup
            selectable
            onSelectEvent={event => console.log(event)}
            onSelectSlot={slotInfo => console.log(slotInfo)}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard 
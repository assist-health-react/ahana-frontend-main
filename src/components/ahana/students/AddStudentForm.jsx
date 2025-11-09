import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import { membersService } from '../../../services/membersService';
import { uploadMedia } from '../../../services/mediaService';
import Select from 'react-select';
import api from '../../../services/api';
import { useOutletContext } from 'react-router-dom';

const AddStudentForm = ({ isOpen, onClose, initialData = null, onSuccess }) => {
  const { schoolId, schoolData } = useOutletContext() || {};
  
  const initialFormState = {
    name: '',
    dateOfBirth: '',
    gender: '',
    mobile: '',
    email: '',
    class: '',
    section: '',
    guardianName: '',
    guardianMobile: '',
    guardianRelation: '',
    bloodGroup: '',
    heightInFt: '',
    weightInKg: '',
    profilePic: '',
    address: {
      description: '',
      pinCode: '',
      region: '',
      landmark: '',
      state: '',
      country: 'India',
      location: {
        latitude: null,
        longitude: null
      }
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const isSubmittingRef = useRef(false);

  // Get available classes and sections from school data
  const availableClasses = schoolData?.grades?.map(grade => ({
    value: grade.class,
    label: grade.class
  })) || [];

  const getAvailableSections = (selectedClass) => {
    const grade = schoolData?.grades?.find(g => g.class === selectedClass);
    return grade?.section?.map(s => ({
      value: s.name,
      label: s.name
    })) || [];
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const guardianRelations = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Guardian' }
  ];

  // Handle form close
  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    setRegionOptions([]);
    onClose();
  };

  // Effect to populate form data when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('AddStudentForm received initialData:', initialData);
      const formattedData = {
        name: initialData.name || '',
        dateOfBirth: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
        gender: initialData.gender || '',
        mobile: initialData.phone?.replace('+91', '').replace(/\D/g, '') || '',
        alternateMobile: initialData.alternatePhone?.replace('+91', '').replace(/\D/g, '') || '',
        email: initialData.email || '',
        class: initialData.studentDetails?.grade || '',
        section: initialData.studentDetails?.section || '',
        guardianName: initialData.emergencyContact?.name || '',
        guardianMobile: initialData.emergencyContact?.phone?.replace('+91', '').replace(/\D/g, '') || '',
        guardianRelation: initialData.emergencyContact?.relation?.toLowerCase() || '',
        bloodGroup: initialData.bloodGroup || '',
        heightInFt: initialData.heightInFt || '',
        weightInKg: initialData.weightInKg || '',
        profilePic: initialData.profilePic || '',
        address: {
          description: initialData.address?.[0]?.description || '',
          pinCode: initialData.address?.[0]?.pinCode || '',
          region: initialData.address?.[0]?.region || '',
          landmark: initialData.address?.[0]?.landmark || '',
          state: initialData.address?.[0]?.state || '',
          country: initialData.address?.[0]?.country || 'India',
          location: {
            latitude: initialData.address?.[0]?.location?.latitude || null,
            longitude: initialData.address?.[0]?.location?.longitude || null
          }
        }
      };
      console.log('Setting form data:', formattedData);
      setFormData(formattedData);

      // If there's a pincode, fetch the region options
      if (initialData.address?.[0]?.pinCode) {
        handlePincodeChange({ target: { value: initialData.address[0].pinCode } });
      }
    } else {
      setFormData(initialFormState);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Mobile validation
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // School validation
    if (!formData.class) {
      newErrors.class = 'Class is required';
    }

    // Section validation
    if (!formData.section) {
      newErrors.section = 'Section is required';
    }

    // Blood Group validation
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    // Optional field validations
    // Guardian Mobile validation (only if provided)
    if (formData.guardianMobile?.trim() && !/^[0-9]{10}$/.test(formData.guardianMobile.replace(/\D/g, ''))) {
      newErrors.guardianMobile = 'Please enter a valid 10-digit mobile number';
    }

    // PIN code validation (only if provided)
    if (formData.address.pinCode?.trim() && !/^[0-9]{6}$/.test(formData.address.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
    }

    // Height validation
    if (formData.heightInFt && (isNaN(formData.heightInFt) || formData.heightInFt <= 0)) {
      newErrors.heightInFt = 'Please enter a valid height';
    }

    // Weight validation
    if (formData.weightInKg && (isNaN(formData.weightInKg) || formData.weightInKg <= 0)) {
      newErrors.weightInKg = 'Please enter a valid weight';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert('File size should be less than 5MB');
      e.target.value = '';
      return;
    }

    setIsUploadingImage(true);
    try {
      const response = await uploadMedia(file);
      console.log('Upload response:', response);

      if (response?.imageUrl) {
        setFormData(prev => ({
          ...prev,
          profilePic: response.imageUrl
        }));
      } else {
        throw new Error('No image URL received from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = ''; // Reset file input
    }
  };
  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (formData.profilePic && !initialData?.profilePic) {
        URL.revokeObjectURL(formData.profilePic);
      }
    };
  }, [formData.profilePic, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm() || isSubmittingRef.current) return;

    setIsSubmitting(true);
    isSubmittingRef.current = true;

    try {
      // Format phone numbers to ensure exactly 10 digits and add +91 prefix
      const formattedPhone = formData.mobile ? `+91${formData.mobile.replace(/\D/g, '').slice(0, 10)}` : '';
      const formattedGuardianPhone = formData.guardianMobile ? `+91${formData.guardianMobile.replace(/\D/g, '').slice(0, 10)}` : '';
      const formattedAlternateMobile = formData.alternateMobile ? `+91${formData.alternateMobile.replace(/\D/g, '').slice(0, 10)}` : '';

      // Prepare data for API
      const studentData = {
        isStudent: true,
        name: formData.name.trim(),
        phone: formattedPhone,
        alternatePhone: formattedAlternateMobile || undefined,
        email: formData.email.trim(),
        dob: formData.dateOfBirth,
        gender: formData.gender.toLowerCase(),
        bloodGroup: formData.bloodGroup,
        heightInFt: parseFloat(formData.heightInFt) || undefined,
        weightInKg: parseFloat(formData.weightInKg) || undefined,
        employmentStatus: "student",
        studentDetails: {
          schoolId: schoolId,
          grade: formData.class,
          section: formData.section
        }
      };

      // Only add address if any address field is filled
      if (formData.address.description || formData.address.pinCode || formData.address.landmark || formData.address.region || formData.address.state) {
        studentData.address = {
          description: formData.address.description.trim(),
          pinCode: formData.address.pinCode.trim(),
          region: formData.address.region.trim(),
          landmark: formData.address.landmark.trim(),
          state: formData.address.state.trim(),
          country: formData.address.country,
          location: {
            latitude: formData.address.location.latitude || null,
            longitude: formData.address.location.longitude || null
          }
        };
      }

      // Only add emergency contact if any contact field is filled
      if (formData.guardianName || formData.guardianMobile || formData.guardianRelation) {
        studentData.emergencyContact = {
          name: formData.guardianName.trim(),
          relation: formData.guardianRelation.toLowerCase(),
          phone: formattedGuardianPhone
        };
      }

      // Add profile pic if available
      if (formData.profilePic) {
        studentData.profilePic = formData.profilePic;
      }

      let response;
      if (initialData?._id) {
        // Update existing student
        response = await membersService.updateMember(initialData._id, studentData);
      } else {
        // Create new student
        response = await membersService.createMember(studentData);
      }
      
      if (response.status === 'success') {
        alert(initialData ? 'Student updated successfully!' : 'Student added successfully!');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert(error.message || 'Error saving student. Please try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // Update mobile number validation to ensure exactly 10 digits
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile and guardian mobile fields, restrict to 10 digits
    if (name === 'mobile' || name === 'guardianMobile' || name === 'alternateMobile') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePincodeChange = async (e) => {
    const pinCode = e.target.value;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        pinCode
      }
    }));

    // Only proceed if we have a 6-digit pincode
    if (pinCode.length === 6) {
      setIsLoadingRegions(true);
      try {
        const data = await api.get(`/api/v1/common/pincode/${pinCode}`);
        console.log('API Response Data:', data);

        // Check if we have valid data
        if (data && Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0].PostOffice)) {
          const postOffices = data[0].PostOffice;
          console.log('Post Offices:', postOffices);

          if (postOffices.length > 0) {
            // Create region options from all post offices
            const regions = postOffices.map(office => ({
              value: office.Name,
              label: office.Name,
              district: office.District,
              state: office.State
            }));
            
            console.log('Region Options:', regions);
            setRegionOptions(regions);

            // Use the first post office for default values
            const firstPostOffice = postOffices[0];
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                region: '',  // Don't set a default region, let user select
                state: firstPostOffice.State,
                city: firstPostOffice.District,
                country: 'India'
              }
            }));
          } else {
            setRegionOptions([]);
            setErrors(prev => ({
              ...prev,
              pinCode: 'No areas found for this PIN code'
            }));
            console.error('No post offices found in the response');
          }
        } else {
          setRegionOptions([]);
          setErrors(prev => ({
            ...prev,
            pinCode: 'Invalid PIN code'
          }));
          console.error('Invalid response format or no data found');
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error);
        setRegionOptions([]);
        setErrors(prev => ({
          ...prev,
          pinCode: error.message || 'Error fetching PIN code details'
        }));
      } finally {
        setIsLoadingRegions(false);
      }
    } else {
      // Reset region options if pincode is incomplete
      setRegionOptions([]);
      // Reset region and state if pincode is changed
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          region: '',
          state: '',
          city: '',
          country: 'India'
        }
      }));
      // Clear any pincode-related errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.pinCode;
        return newErrors;
      });
    }
  };

  const handleRegionChange = (selectedOption) => {
    if (!selectedOption) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          region: '',
          state: '',
          city: ''
        }
      }));
      return;
    }

    // Find the selected region's data from regionOptions
    const selectedRegion = regionOptions.find(option => option.value === selectedOption.value);
    if (selectedRegion) {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          region: selectedRegion.value,
          state: selectedRegion.state,
          city: selectedRegion.district
        }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose}></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl px-0 pt-0 pb-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Header */}
          <div className="px-6 py-4 bg-blue-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                {initialData ? 'Edit Student' : 'Add New Student'}
              </h3>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="space-y-8">
              {/* Profile Picture Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h4>
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32">
                    {formData.profilePic ? (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                        <img 
                          src={formData.profilePic} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random&size=128`;
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              profilePic: ''
                            }));
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove photo"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                        <span className="text-4xl text-gray-400">
                          {formData.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                        <FaSpinner className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        className="hidden"
                      />
                      <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <FaCamera className="mr-2" />
                        {formData.profilePic ? 'Change Photo' : 'Upload Photo'}
                      </span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG, GIF, or WebP up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Details Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Student Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth*
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender*
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.gender ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number*
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter mobile number"
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternate Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.alternateMobile ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter alternate mobile number"
                    />
                    {errors.alternateMobile && (
                      <p className="mt-1 text-sm text-red-600">{errors.alternateMobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Details Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Academic Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School
                    </label>
                    <input
                      type="text"
                      value={schoolData?.name || ''}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class*
                    </label>
                    <Select
                      value={formData.class ? { value: formData.class, label: formData.class } : null}
                      onChange={(selected) => {
                        setFormData(prev => ({
                          ...prev,
                          class: selected?.value || '',
                          section: '' // Reset section when class changes
                        }));
                        if (errors.class) {
                          setErrors(prev => ({ ...prev, class: '' }));
                        }
                      }}
                      options={availableClasses}
                      placeholder="Select Class"
                      className={errors.class ? 'border-red-500' : ''}
                    />
                    {errors.class && (
                      <p className="mt-1 text-sm text-red-600">{errors.class}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section*
                    </label>
                    <Select
                      value={formData.section ? { value: formData.section, label: formData.section } : null}
                      onChange={(selected) => {
                        setFormData(prev => ({
                          ...prev,
                          section: selected?.value || ''
                        }));
                        if (errors.section) {
                          setErrors(prev => ({ ...prev, section: '' }));
                        }
                      }}
                      options={getAvailableSections(formData.class)}
                      isDisabled={!formData.class}
                      placeholder="Select Section"
                      className={errors.section ? 'border-red-500' : ''}
                    />
                    {errors.section && (
                      <p className="mt-1 text-sm text-red-600">{errors.section}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.address.description}
                      onChange={handleAddressChange}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter complete address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.address.pinCode}
                      onChange={handlePincodeChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.pinCode ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter PIN code"
                    />
                    {errors.pinCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pinCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <Select
                      value={regionOptions.find(option => option.value === formData.address.region)}
                      onChange={handleRegionChange}
                      options={regionOptions}
                      isLoading={isLoadingRegions}
                      isClearable
                      placeholder="Select region"
                      className={errors.region ? 'border-red-500' : ''}
                      noOptionsMessage={() => formData.address.pinCode?.length === 6 ? "No regions found" : "Enter PIN code first"}
                    />
                    {errors.region && (
                      <p className="mt-1 text-sm text-red-600">{errors.region}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.address.landmark}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter landmark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter state"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.address.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter country"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Details Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Guardian Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.guardianName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter guardian name"
                    />
                    {errors.guardianName && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Mobile
                    </label>
                    <input
                      type="tel"
                      name="guardianMobile"
                      value={formData.guardianMobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.guardianMobile ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter guardian mobile"
                    />
                    {errors.guardianMobile && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianMobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relation with Guardian
                    </label>
                    <Select
                      value={guardianRelations.find(relation => relation.value === formData.guardianRelation)}
                      onChange={(selected) => setFormData(prev => ({
                        ...prev,
                        guardianRelation: selected?.value || ''
                      }))}
                      options={guardianRelations}
                      className={`w-full ${
                        errors.guardianRelation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Select relation"
                    />
                    {errors.guardianRelation && (
                      <p className="mt-1 text-sm text-red-600">{errors.guardianRelation}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Health Information Section */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Health Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group*
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select blood group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup && (
                      <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (in feet)
                    </label>
                    <input
                      type="number"
                      name="heightInFt"
                      value={formData.heightInFt}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter height"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (in kg)
                    </label>
                    <input
                      type="number"
                      name="weightInKg"
                      value={formData.weightInKg}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter weight"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    initialData ? 'Update Student' : 'Add Student'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentForm; 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Shield, 
  Users,
  Award,
  Globe,
  Zap,
  Leaf,
  DollarSign,
  BarChart3
} from 'lucide-react';

const Info = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  AI-Powered Optimization
                </h3>
                <p className="text-sm text-secondary-600">
                  Advanced machine learning algorithms analyze your plant data to provide intelligent recommendations for emission reduction and cost optimization.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-success-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Carbon Reduction
                </h3>
                <p className="text-sm text-secondary-600">
                  Comprehensive tools and strategies to reduce CO2 emissions through efficiency improvements, carbon capture, and utilization technologies.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-warning-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Cost Optimization
                </h3>
                <p className="text-sm text-secondary-600">
                  Identify and implement cost reduction opportunities while maintaining operational efficiency and environmental compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-secondary-900">Real-time Monitoring</h4>
                      <p className="text-sm text-secondary-600">Continuous monitoring of emissions, efficiency, and operational parameters.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-secondary-900">Predictive Analytics</h4>
                      <p className="text-sm text-secondary-600">AI-driven predictions and recommendations for optimal plant performance.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-secondary-900">Performance Optimization</h4>
                      <p className="text-sm text-secondary-600">Continuous improvement through data-driven insights and recommendations.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-secondary-900">Compliance Management</h4>
                      <p className="text-sm text-secondary-600">Ensure regulatory compliance with automated reporting and monitoring.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-secondary-900">Team Collaboration</h4>
                      <p className="text-sm text-secondary-600">Collaborative tools for teams to work together on optimization projects.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-secondary-900">Environmental Impact</h4>
                      <p className="text-sm text-secondary-600">Track and report on environmental impact and sustainability metrics.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'carbon-capture',
      title: 'Carbon Capture & Utilization',
      icon: Leaf,
      content: (
        <div className="space-y-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Carbon Capture Technologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Post-Combustion Capture</h4>
                  <p className="text-sm text-secondary-600 mb-3">
                    Captures CO2 from flue gases after combustion using chemical solvents like amines.
                  </p>
                  <ul className="text-sm text-secondary-600 space-y-1">
                    <li>• Efficiency: 85-95% CO2 capture</li>
                    <li>• Cost: $40-80 per ton CO2</li>
                    <li>• Maturity: Commercial</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Pre-Combustion Capture</h4>
                  <p className="text-sm text-secondary-600 mb-3">
                    Removes CO2 before combustion in gasification processes.
                  </p>
                  <ul className="text-sm text-secondary-600 space-y-1">
                    <li>• Efficiency: 90-95% CO2 capture</li>
                    <li>• Cost: $30-60 per ton CO2</li>
                    <li>• Maturity: Demonstration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Carbon Utilization Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-secondary-200 rounded-lg">
                  <h4 className="font-medium text-secondary-900 mb-2">Chemicals</h4>
                  <p className="text-sm text-secondary-600">Methanol, Urea, Formic Acid</p>
                </div>
                <div className="text-center p-4 border border-secondary-200 rounded-lg">
                  <h4 className="font-medium text-secondary-900 mb-2">Fuels</h4>
                  <p className="text-sm text-secondary-600">Synthetic fuels, Aviation fuel</p>
                </div>
                <div className="text-center p-4 border border-secondary-200 rounded-lg">
                  <h4 className="font-medium text-secondary-900 mb-2">Materials</h4>
                  <p className="text-sm text-secondary-600">Concrete, Plastics, Carbon fiber</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: Award,
      content: (
        <div className="space-y-6">
          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Emission Reduction Strategies
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h4 className="font-semibold text-secondary-900">Efficiency Improvements</h4>
                  <p className="text-sm text-secondary-600 mt-1">
                    • Boiler optimization and tuning<br/>
                    • Heat recovery systems<br/>
                    • Advanced control systems<br/>
                    • Regular maintenance and cleaning
                  </p>
                </div>
                <div className="border-l-4 border-success-500 pl-4">
                  <h4 className="font-semibold text-secondary-900">Fuel Optimization</h4>
                  <p className="text-sm text-secondary-600 mt-1">
                    • Fuel quality improvement<br/>
                    • Co-firing with biomass<br/>
                    • Fuel switching to natural gas<br/>
                    • Advanced combustion control
                  </p>
                </div>
                <div className="border-l-4 border-warning-500 pl-4">
                  <h4 className="font-semibold text-secondary-900">Carbon Capture</h4>
                  <p className="text-sm text-secondary-600 mt-1">
                    • Post-combustion capture systems<br/>
                    • Pre-combustion capture<br/>
                    • Oxy-fuel combustion<br/>
                    • Direct air capture
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                Cost Optimization Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Operational Efficiency</h4>
                  <ul className="text-sm text-secondary-600 space-y-1">
                    <li>• Optimize load factors</li>
                    <li>• Implement predictive maintenance</li>
                    <li>• Use real-time optimization</li>
                    <li>• Regular performance monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Financial Management</h4>
                  <ul className="text-sm text-secondary-600 space-y-1">
                    <li>• Long-term fuel contracts</li>
                    <li>• Carbon credit trading</li>
                    <li>• Government incentives</li>
                    <li>• Lifecycle cost analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Information Center
          </h1>
          <p className="text-secondary-600">
            Learn about carbon emissions reduction, optimization strategies, and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="card-body">
                <h3 className="font-semibold text-secondary-900 mb-4">Topics</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'hover:bg-secondary-50 text-secondary-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {sections.find(s => s.id === activeSection)?.content}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Info;

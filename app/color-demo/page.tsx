'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function ColorDemoPage() {
  return (
    <div className="min-h-screen bg-hr-bg-primary text-hr-text-primary p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-hr-text-primary">🎨 HR Management Color Palette</h1>
            <p className="text-hr-text-secondary mt-2">Professional color system with light/dark theme support</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Primary Colors */}
        <Card className="bg-hr-bg-elevated border-hr-border-light">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Primary Colors - Professional Blue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[50, 100, 500, 600, 900].map((shade) => (
                <div key={shade} className="text-center">
                  <div 
                    className={`w-full h-16 rounded-lg border border-hr-border-light mb-2 bg-hr-primary-${shade}`}
                  ></div>
                  <p className="text-sm font-medium text-hr-text-primary">Primary {shade}</p>
                  <p className="text-xs text-hr-text-tertiary">bg-hr-primary-{shade}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Background Colors */}
        <Card className="bg-hr-bg-elevated border-hr-border-light">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Background Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Primary', class: 'bg-hr-bg-primary' },
                { name: 'Secondary', class: 'bg-hr-bg-secondary' },
                { name: 'Tertiary', class: 'bg-hr-bg-tertiary' },
                { name: 'Elevated', class: 'bg-hr-bg-elevated' }
              ].map((bg) => (
                <div key={bg.name} className="text-center">
                  <div className={`w-full h-16 rounded-lg border border-hr-border-light mb-2 ${bg.class}`}></div>
                  <p className="text-sm font-medium text-hr-text-primary">{bg.name} Background</p>
                  <p className="text-xs text-hr-text-tertiary">{bg.class}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card className="bg-hr-bg-elevated border-hr-border-light">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Text Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-hr-bg-secondary rounded-lg">
                <p className="text-hr-text-primary text-lg font-semibold">Primary Text - Main content</p>
                <p className="text-hr-text-secondary">Secondary Text - Supporting content</p>
                <p className="text-hr-text-tertiary">Tertiary Text - Subtle content</p>
                <p className="text-hr-text-inverse bg-hr-primary-500 px-2 py-1 rounded inline-block">Inverse Text - On dark backgrounds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Colors */}
        <Card className="bg-hr-bg-elevated border-hr-border-light">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Status Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Success', class: 'bg-hr-success-500', text: 'text-hr-success-700' },
                { name: 'Warning', class: 'bg-hr-warning-500', text: 'text-hr-warning-700' },
                { name: 'Danger', class: 'bg-hr-danger-500', text: 'text-hr-danger-700' },
                { name: 'Info', class: 'bg-hr-info-500', text: 'text-hr-info-700' }
              ].map((status) => (
                <div key={status.name} className="text-center">
                  <div className={`w-full h-16 rounded-lg border border-hr-border-light mb-2 ${status.class}`}></div>
                  <p className="text-sm font-medium text-hr-text-primary">{status.name}</p>
                  <p className="text-xs text-hr-text-tertiary">{status.class}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component Examples */}
        <Card className="bg-hr-bg-elevated border-hr-border-light">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Component Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold text-hr-text-primary mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-hr-primary-500 hover:bg-hr-primary-600 text-hr-text-inverse">
                    Primary Button
                  </Button>
                  <Button variant="secondary" className="bg-hr-bg-secondary hover:bg-hr-bg-tertiary text-hr-text-primary">
                    Secondary Button
                  </Button>
                  <Button variant="outline" className="border-hr-border-medium text-hr-text-primary">
                    Outline Button
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold text-hr-text-primary mb-3">Status Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-hr-success-100 text-hr-success-700">Success</Badge>
                  <Badge className="bg-hr-warning-100 text-hr-warning-700">Warning</Badge>
                  <Badge className="bg-hr-danger-100 text-hr-danger-700">Danger</Badge>
                  <Badge className="bg-hr-info-100 text-hr-info-700">Info</Badge>
                </div>
              </div>

              {/* Input Fields */}
              <div>
                <h3 className="text-lg font-semibold text-hr-text-primary mb-3">Input Fields</h3>
                <div className="space-y-3 max-w-md">
                  <Input 
                    placeholder="Enter your name" 
                    className="bg-hr-bg-primary border-hr-border-medium text-hr-text-primary focus:border-hr-primary-500"
                  />
                  <Input 
                    placeholder="Enter your email" 
                    className="bg-hr-bg-primary border-hr-border-medium text-hr-text-primary focus:border-hr-primary-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Card className="bg-hr-bg-elevated border-hr-border-light">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-hr-text-secondary">
              <div>
                <h4 className="font-semibold text-hr-text-primary mb-2">CSS Classes:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code className="bg-hr-bg-tertiary px-2 py-1 rounded text-sm">bg-hr-primary-500</code> - Primary background</li>
                  <li><code className="bg-hr-bg-tertiary px-2 py-1 rounded text-sm">text-hr-text-primary</code> - Primary text</li>
                  <li><code className="bg-hr-bg-tertiary px-2 py-1 rounded text-sm">border-hr-border-light</code> - Light border</li>
                  <li><code className="bg-hr-bg-tertiary px-2 py-1 rounded text-sm">bg-hr-success-500</code> - Success color</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-hr-text-primary mb-2">Theme Toggle:</h4>
                <p>Click the theme toggle button in the header to switch between light and dark modes. The colors will automatically adjust for optimal contrast and readability.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


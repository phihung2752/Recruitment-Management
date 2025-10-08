'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, Star, Clock, Users } from "lucide-react"

interface Question {
  id: string
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'technical' | 'behavioral' | 'situational'
  rating: number
  usageCount: number
  lastUsed: string
  tags: string[]
}

export default function QuestionBankTab() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'Tell me about yourself and your experience with React.',
      category: 'Frontend Development',
      difficulty: 'easy',
      type: 'behavioral',
      rating: 4.5,
      usageCount: 15,
      lastUsed: '2024-01-15',
      tags: ['react', 'frontend', 'introduction']
    },
    {
      id: '2',
      question: 'How would you optimize a slow-loading website?',
      category: 'Performance',
      difficulty: 'medium',
      type: 'technical',
      rating: 4.2,
      usageCount: 8,
      lastUsed: '2024-01-10',
      tags: ['performance', 'optimization', 'web']
    },
    {
      id: '3',
      question: 'Describe a time when you had to work with a difficult team member.',
      category: 'Teamwork',
      difficulty: 'medium',
      type: 'situational',
      rating: 4.0,
      usageCount: 12,
      lastUsed: '2024-01-12',
      tags: ['teamwork', 'communication', 'conflict']
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'technical' as 'technical' | 'behavioral' | 'situational',
    tags: ''
  })

  const categories = ['Frontend Development', 'Backend Development', 'Database', 'System Design', 'Teamwork', 'Leadership', 'Problem Solving']
  const difficulties = ['easy', 'medium', 'hard']
  const types = ['technical', 'behavioral', 'situational']

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      const question: Question = {
        id: Date.now().toString(),
        question: newQuestion.question,
        category: newQuestion.category,
        difficulty: newQuestion.difficulty,
        type: newQuestion.type,
        rating: 0,
        usageCount: 0,
        lastUsed: '',
        tags: newQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }
      setQuestions([...questions, question])
      setNewQuestion({
        question: '',
        category: '',
        difficulty: 'medium',
        type: 'technical',
        tags: ''
      })
      setShowAddForm(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'bg-blue-500'
      case 'behavioral': return 'bg-purple-500'
      case 'situational': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-hr-text-primary">Question Bank</h2>
          <p className="text-hr-text-secondary">Manage interview questions and templates</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-hr-accent text-white hover:bg-hr-accent/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-hr-bg-secondary border-hr-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-hr-bg-primary border-hr-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-hr-bg-primary border-hr-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[140px] bg-hr-bg-primary border-hr-border">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="bg-hr-bg-secondary border-hr-border hover:border-hr-accent transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                  <Badge className={getTypeColor(question.type)}>
                    {question.type}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-sm text-hr-text-primary line-clamp-2">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-hr-text-secondary">
                  <span className="font-medium">Category:</span>
                  <span>{question.category}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-hr-text-secondary">
                  <Star className="h-4 w-4" />
                  <span>{question.rating.toFixed(1)}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{question.usageCount} uses</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {question.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Question Form */}
      {showAddForm && (
        <Card className="bg-hr-bg-secondary border-hr-border">
          <CardHeader>
            <CardTitle className="text-hr-text-primary">Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your question here..."
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
              className="bg-hr-bg-primary border-hr-border"
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}>
                <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newQuestion.difficulty} onValueChange={(value: any) => setNewQuestion({...newQuestion, difficulty: value})}>
                <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newQuestion.type} onValueChange={(value: any) => setNewQuestion({...newQuestion, type: value})}>
                <SelectTrigger className="bg-hr-bg-primary border-hr-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Tags (comma separated)"
              value={newQuestion.tags}
              onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
              className="bg-hr-bg-primary border-hr-border"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddQuestion} className="bg-hr-accent text-white hover:bg-hr-accent/90">
                Add Question
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}







"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from 'lucide-react'

interface Question {
  id: string
  text: string
  category: string
}

interface Category {
  id: string
  name: string
}

export function InterviewQuestionsManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Technical Skills" },
    { id: "2", name: "Soft Skills" },
    { id: "3", name: "Problem Solving" },
  ])
  const [newQuestion, setNewQuestion] = useState<Omit<Question, "id">>({ text: "", category: "" })
  const [newCategory, setNewCategory] = useState<string>("")

  const addQuestion = () => {
    if (newQuestion.text && newQuestion.category) {
      setQuestions([...questions, { ...newQuestion, id: Date.now().toString() }])
      setNewQuestion({ text: "", category: "" })
    }
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const addCategory = () => {
    if (newCategory) {
      setCategories([...categories, { id: Date.now().toString(), name: newCategory }])
      setNewCategory("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Textarea
                  placeholder="Enter new question"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                />
              </div>
              <Select
                value={newQuestion.category}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addQuestion} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Questions List</h3>
            <ul className="space-y-2">
              {questions.map(question => (
                <li key={question.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{question.text}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{categories.find(c => c.id === question.category)?.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={addCategory}>Add Category</Button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Categories List</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.id} className="bg-gray-100 p-2 rounded">
                  {category.name}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

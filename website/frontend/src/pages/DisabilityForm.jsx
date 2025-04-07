import { useState } from "react"
import { Button, Checkbox, TextInput, Paper, Transition } from "@mantine/core"

export default function DisabilityForm() {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [otherText, setOtherText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const disabilityOptions = [
    { id: "visual", label: "Visual impairment" },
    { id: "hearing", label: "Hearing impairment" },
    { id: "mobility", label: "Mobility impairment" },
    { id: "learning", label: "Learning disability (e.g., dyslexia, ADHD)" },
    { id: "neurodivergent", label: "Neurodivergent learning needs (e.g., autism)" },
    { id: "speech", label: "Speech impairment" },
    { id: "cognitive", label: "Cognitive disability" },
    { id: "other", label: "Other" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate at least one option is selected
    if (selectedOptions.length === 0) {
      setError("Please select at least one option")
      return
    }

    // If "Other" is selected but no text is provided
    if (selectedOptions.includes("other") && !otherText.trim()) {
      setError("Please specify your disability in the 'Other' field")
      return
    }

    setIsLoading(true)

    try {
      // Prepare form data
      const formData = {
        disabilities: selectedOptions,
        otherDisability: selectedOptions.includes("other") ? otherText : "",
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Form submitted:", formData)
      setSuccess(true)
    } catch (err) {
      setError("An error occurred while submitting the form. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionChange = (optionId) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId)
      } else {
        return [...prev, optionId]
      }
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Paper className="p-6 text-center" shadow="sm">
          <h2 className="text-xl font-semibold mb-2">Thank you for your submission!</h2>
          <p className="text-gray-600">Your response has been recorded.</p>
          <Button
            className="mt-4"
            onClick={() => {
              setSuccess(false)
              setSelectedOptions([])
              setOtherText("")
            }}
          >
            Submit another response
          </Button>
        </Paper>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-blue-50">
      <Paper shadow="sm" p="md" className="w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl">
          <div className="space-y-4">
            <fieldset>
              <legend className="text-lg font-semibold mb-3 text-center">
                Do you face any of the following disabilities?
              </legend>
              <div className="space-y-3 grid grid-cols-2">
                {disabilityOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors m-4 ${
                      selectedOptions.includes(option.id) 
                        ? 'bg-orange-100 border-orange-300' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleOptionChange(option.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 flex items-center justify-center rounded border ${
                        selectedOptions.includes(option.id)
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOptions.includes(option.id) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="ml-2">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
            <Transition mounted={selectedOptions.includes("other")} transition="slide-down" duration={100} timingFunction="ease">
              {(styles) => (
                <div style={styles} className="mt-3 pl-6">
                  <TextInput
                    label="Please specify:"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Please describe your disability"
                  />
                </div>
              )}
            </Transition>
          </div>
          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" loading={isLoading} fullWidth>
            Submit
          </Button>
        </form>
      </Paper>
    </div>
  );
}


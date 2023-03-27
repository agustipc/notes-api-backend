const { palindrome } = require('../utils/for_testing')

test('palindrome', () => {
  const result = palindrome('midudev')
  console.log(result)

  expect(result).toBe('vedudim')
})

test('plaindrome of empty string', () => {
  const result = palindrome('')

  expect(result).toBe('')
})

test('plaindrome of undefined', () => {
  const result = palindrome()

  expect(result).toBeUndefined()
})

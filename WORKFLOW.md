# WORKFLOW.md

# AI Development Workflow Comparison

This exercise compared two AI-assisted development workflows for implementing the same feature: a Profile Settings form. The first version was generated using a single vague prompt, while the second version used a structured prompt with clear requirements, constraints, file references, expected behavior, and a verification step.

## Correctness

The first implementation produced a functional profile settings form, but it made several assumptions and lacked complete validation. Some fields accepted invalid input, error messages were limited, and the form focused primarily on appearance rather than user interaction. The second implementation was noticeably more reliable because the prompt specified validation rules, expected behaviors, and a verification process. As a result, the generated code handled required fields, email validation, password confirmation, loading states, and success feedback more consistently.

## Accessibility

Accessibility was one of the biggest differences between the two versions. The vague prompt generated a visually acceptable form but did not consistently include semantic labels, keyboard-friendly interactions, or accessible validation feedback. The engineered prompt explicitly required semantic HTML, visible labels, keyboard navigation, focus indicators, and accessibility considerations. This produced a form that was easier to use and closer to WCAG best practices.

## Edge Cases

The engineered workflow considered situations that the vague prompt ignored. These included invalid email formats, mismatched passwords, empty required fields, and preventing form submission until validation passed. By asking the AI to review its own implementation and identify edge cases before finishing, the second version reduced the amount of manual debugging required after generation.

## Review Effort

Although writing the engineered prompt took longer, reviewing the generated code was much faster. The vague version required more manual checking, corrections, and assumptions because many implementation details were left to the AI. In contrast, the engineered version followed the requested specifications more closely, making the review process more focused on verification instead of fixing missing functionality.

## AI Mistake I Caught

One issue I noticed during review was that a few validation rules were overlooked. For example, the Name field accepted numbers and special characters instead of restricting input to letters only, and the Email field only performed basic validation instead of requiring a complete, properly formatted email address. I updated the validation rules to enforce these constraints before allowing the form to be submitted.

## Conclusion

This comparison demonstrated that prompt quality has a direct impact on development quality. A vague prompt generated working code quickly but required significantly more review and corrections. The engineered prompt produced a more complete, accessible, and maintainable solution by providing clear requirements, constraints, and verification steps. Although it took more time to write, it reduced overall development and review effort, making it the more efficient workflow.
/* Reviewed English versions of every built-in principle and every detail block.
   The order matches the Chinese catalogue; no subsection is dropped. */
(() => {
  const content = {
    nielsen: ['Nielsen’s Usability Heuristics','Ten practical principles for evaluating interface usability',
      'Jakob Nielsen’s heuristics are broad guidelines for interaction design. Use them to identify common usability issues, then validate the design with real users.',
      [
        ['System status visibility','Keep users informed about what the system is doing, with timely feedback.','Show upload progress, loading states and a clear indication when an action has finished.','Reduces uncertainty and helps users choose their next step.'],
        ['Match the real world','Use concepts, language and sequences familiar to the intended audience.','A shopping cart represents selected items; a calendar uses familiar dates and chronological order.','Makes unfamiliar interfaces easier to understand.'],
        ['User control and freedom','Provide clear ways to cancel, go back and undo unintended actions.','Offer Undo after deletion and let people cancel a dialog without losing their work.','Supports exploration and recovery from mistakes.'],
        ['Consistency and standards','Follow platform conventions and use consistent terms, layouts and interactions.','Use one save icon and a consistent navigation pattern throughout the product.','Reduces learning effort and builds predictable behavior.'],
        ['Prevent errors','Use constraints and clear choices to prevent avoidable mistakes before they happen.','Disable submission when required fields are missing and check risky actions before committing them.','Improves task completion by reducing preventable errors.'],
        ['Recognition over recall','Keep relevant objects and choices visible instead of requiring users to remember them.','Show recent items, font previews and previously selected options.','Reduces memory demands.'],
        ['Flexible and efficient use','Support both newcomers and experienced users with appropriate shortcuts.','Provide keyboard shortcuts, search and efficient ways to repeat frequent actions.','Helps experienced users work faster while keeping basic tasks approachable.'],
        ['Minimalist presentation','Remove irrelevant information so the important content remains easy to find.','Keep a search page focused and remove decorative elements that compete with the task.','Improves the signal-to-noise ratio.'],
        ['Help users recover from errors','Explain the problem in plain language and offer a practical next step.','Suggest checking the network when a connection fails, or provide password recovery after a failed sign-in.','Reduces frustration and helps users complete the task.'],
        ['Help and documentation','Provide searchable help with clear steps when the task requires it.','Use onboarding, contextual tooltips and an accessible FAQ.','Supports users when the interface alone cannot explain a complex task.']
      ]],
    wcag: ['WCAG Accessibility Guidelines','Make interfaces usable by people with different abilities',
      'The Web Content Accessibility Guidelines organize accessibility around four principles: perceivable, operable, understandable and robust.',
      [
        ['Perceivable','Present information in forms users can perceive; do not rely on vision alone.','Provide useful image alternatives and captions for video.','Helps people with sensory disabilities access the same information.'],
        ['Operable','Make controls usable with different input methods, including a keyboard.','Provide visible keyboard focus and avoid flashing content that could trigger seizures.','Supports people who cannot use a mouse or need alternative input methods.'],
        ['Understandable','Make information, instructions and interactions clear and predictable.','Explain form errors and avoid unexplained specialist terminology.','Reduces cognitive barriers.'],
        ['Robust','Use content and interface semantics that assistive technologies can interpret reliably.','Use appropriate HTML elements, labels and accessible control names.','Improves compatibility with browsers and assistive technologies.']
      ]],
    ai_guide: ['Human–AI Interaction Guidelines','Set expectations and support correction',
      'AI systems can produce uncertain or incorrect results. Interfaces should explain their capabilities, support correction and adapt carefully over time.',
      [
        ['Make capabilities clear','Help users understand what the system can and cannot do.','Explain supported tasks and the circumstances in which generated answers may be unreliable.','Builds realistic expectations and reduces misplaced trust.'],
        ['Support efficient correction','Make it easy to edit, refine or recover from an incorrect AI result.','Let users revise an image-generation request or edit a misrecognized voice command.','Turns an error into an opportunity to improve the result.'],
        ['Learn from user behavior','Use appropriate feedback and preferences to improve the experience over time.','Personalize music recommendations or remember explicitly selected preferences.','Supports useful long-term personalization.']
      ]],
    vui: ['Voice Interface Principles','Design conversations without a full visual interface',
      'Voice interfaces, including assistants and in-car systems, need concise prompts, clear turn-taking and useful ways to recover when recognition fails.',
      [
        ['Cooperative conversation','Make responses relevant, accurate and concise, following the user’s conversational context.','For a weather question, give the location, conditions and temperature rather than a long explanation.','Reduces listening effort and makes conversation feel natural.'],
        ['Error handling and confirmation','Spoken information is sequential, so users cannot scan it as they can a screen.','When recognition is uncertain, ask whether the user meant a particular artist or command.','Prevents confusion and helps the conversation continue.']
      ]],
    spatial: ['Spatial Computing Principles','Design for gaze, gestures and immersive environments',
      'Spatial interfaces extend beyond a flat screen. Gaze can identify a target, while gestures or other input methods confirm the intended action.',
      [
        ['Coordinate gaze and gestures','Separate targeting from confirmation so users can look around without triggering actions.','Highlight a target under gaze and confirm it with a supported pinch gesture.','Makes the interaction easier to learn and helps prevent accidental activation.'],
        ['Comfortable placement','Place key content at a comfortable distance and within a convenient viewing area.','Keep primary windows in front of the user and avoid requiring frequent head turns.','Reduces physical effort; validate placement for the device and task.'],
        ['Control immersion','Give users a clear way to adjust how much virtual content surrounds them.','A supported device control can move between a view of the room and a virtual environment.','Preserves the user’s sense of control over the environment.']
      ]],
    fitts: ['Fitts’s Law','Target size and distance affect pointing effort',
      'Reaching a larger or closer target is generally easier than reaching a smaller or more distant one. Use this relationship when positioning interactive controls.',
      [
        ['The pointing-time model','T = a + b log₂(D/W + 1). Movement time depends on the ratio between distance D and target width W.','Use the model to consider target size and travel distance for a particular pointing task.','Offers a quantitative way to reason about pointing efficiency.'],
        ['Thumb reach','Place frequent mobile actions where users can reach them comfortably.','Bottom navigation, reachable browser controls and lower dialog actions can reduce hand movement.','Improves comfort during one-handed use.'],
        ['Screen edges and corners','A pointer constrained by a screen edge can make targets at that edge easier to acquire.','A desktop menu bar at the top edge or a corner-positioned system control can benefit from the boundary.','Uses pointer boundaries to reduce precise aiming; the benefit depends on the input method.']
      ]],
    doherty: ['Doherty Threshold','Keep interactions responsive',
      'Fast responses help users maintain focus and momentum. Around 400 milliseconds is a commonly cited reference for short interactions, rather than a universal deadline.',
      [
        ['Immediate feedback','Acknowledge an input promptly, even if the full operation will take longer.','Show a pressed state when a button is activated and update the selected tab immediately.','Confirms that the system received the action.'],
        ['Perceived performance','Explain progress and provide useful intermediate states while work continues.','Use skeleton content, optimistic feedback where safe, and meaningful progress indicators.','Makes waiting easier to understand without hiding failures.']
      ]],
    norman: ['Emotional Design','Don Norman’s three levels of design',
      'Useful products can also create emotional connections. Norman describes visceral, behavioral and reflective aspects of the experience.',
      [
        ['Visceral','The immediate response to appearance and sensory qualities.','Material finish, a streamlined silhouette or carefully drawn icons influence the first impression.','Affects whether people feel drawn to the product.'],
        ['Behavioral','The experience of function, performance and usability during an activity.','Smooth scrolling, a straightforward purchase flow and a comfortable controller support successful use.','Helps users complete their tasks.'],
        ['Reflective','The meaning associated with memories, identity and personal values.','A product can express status, connect people through shared stories or support environmental values.','Can contribute to lasting emotional attachment.']
      ]],
    miller: ['Miller’s Law','Working memory and meaningful chunks',
      'Miller’s research highlighted limits in short-term memory and the value of chunking. The familiar 7 ± 2 figure is not a universal rule for the number of menu items.',
      [
        ['Chunking','Group information into meaningful units that are easier to remember.','Separate a phone number into readable groups, or space a card number in groups of four.','Improves readability and supports recall.'],
        ['Manage choice complexity','Organize options so users can understand and compare them without holding everything in memory.','Keep primary navigation focused and provide useful grouping for less frequent actions.','Reduces cognitive load; test the structure with the actual task and content.']
      ]],
    hick: ['Hick–Hyman Law','More uncertain choices can take longer',
      'Choice time tends to increase as the number and uncertainty of alternatives grow. Clear organization can make decisions easier.',
      [
        ['Reduce unnecessary choices','Remove options that are irrelevant to the current task.','Give a landing page a clear primary action and simplify frequently used controls.','Reduces avoidable decision effort.'],
        ['Guide complex tasks in steps','Divide a demanding task into understandable stages.','A registration flow can ask for contact details, verification and a password in separate stages.','Reduces the amount of information presented at once.']
      ]],
    peakend: ['Peak–End Rule','Memorable moments and endings shape recollection',
      'People’s recollection of an experience can be influenced strongly by its most intense moment and its ending, rather than by an average of every moment.',
      [
        ['Create a positive peak','Include a moment of genuine convenience, clarity or pleasant surprise.','A game reward animation or a reassuring purchase confirmation can make a moment memorable.','Adds a positive moment without excusing problems elsewhere in the experience.'],
        ['Improve the ending','Finish a flow with a clear and satisfying outcome.','Confirm a successful delivery order or offer a useful final step after completing a task.','Helps users leave with a positive and understandable conclusion.']
      ]],
    gestalt: ['Gestalt Principles','How people organize visual information',
      'Gestalt principles describe how visual elements are perceived as groups and relationships. They help explain the structure of a layout.',
      [
        ['Proximity','Elements close together are often perceived as belonging together.','Place a label closer to its input than to the previous form row.','Uses spacing to express grouping and hierarchy.'],
        ['Common region','Elements within a shared area are often perceived as one group.','A shared background can connect the content and actions belonging to one object.','Clarifies ownership when spacing alone is insufficient.'],
        ['Similarity','Elements with similar visual properties can appear related.','Use a consistent link treatment and a shared button style for similar actions.','Helps users recognize functional patterns.'],
        ['Continuity','People tend to follow smooth, continuous visual paths.','Show part of the next item to indicate that a horizontal collection continues.','Guides attention and helps reveal content beyond the current view.'],
        ['Closure','People can perceive a complete form from incomplete visual information.','An open loading ring or a minimal outline can suggest a complete shape.','Supports concise forms and useful negative space.'],
        ['Common fate','Elements moving together can be perceived as one group.','Animate a menu as a group or move a page together during a back gesture.','Connects motion to the relationship between elements.'],
        ['Figure and ground','People distinguish a foreground object from its background.','Dim the surrounding interface when a modal dialog needs attention.','Helps direct attention to the active layer.']
      ]],
    vonrestorff: ['Von Restorff Effect','Distinctive items are easier to remember',
      'An item that differs from similar surrounding items can be more memorable. Contrast can highlight a meaningful exception.',
      [
        ['Emphasize the main action','Give an important action a distinct treatment relative to nearby secondary actions.','A neutral Cancel button and a prominent Confirm button make the intended hierarchy clear.','Directs attention without making every control compete for emphasis.']
      ]],
    hook: ['Hook Model','A framework for habit-forming products',
      'Nir Eyal’s model describes a cycle of triggers, actions, variable rewards and investment. Use it to understand repeated engagement.',
      [
        ['Trigger','A prompt can come from the environment or from a person’s internal need.','A message notification is an external trigger; wanting social connection can be an internal one.','Initiates the engagement cycle.'],
        ['Action','The user performs an accessible action supported by motivation and ability.','Double-tapping to like or pulling to refresh makes the next action easy.','Reduces the effort required to proceed.'],
        ['Variable reward','An uncertain result can sustain curiosity and repeated engagement.','A changing content feed or an unpredictable social response can encourage another visit.','Helps explain engagement patterns; design with the user’s interests in mind.'],
        ['Investment','Users contribute time, content or relationships that make the product more personally useful.','Saving playlists, building a following or completing a profile adds personal value.','Makes future interactions more relevant and increases switching effort.']
      ]],
    kano: ['Kano Model','Understand how features affect satisfaction',
      'Features can influence satisfaction in different ways. The Kano model helps distinguish basic expectations, performance attributes and unexpected benefits.',
      [
        ['Basic expectations','People expect these features; their absence causes dissatisfaction.','A messaging product must reliably send messages, and a service must meet its basic promises.','Defines the foundation the product needs to provide.'],
        ['Performance attributes','Better performance on these attributes generally increases satisfaction.','Battery life, connection speed and available storage can improve with measurable performance.','Highlights areas for competitive improvement.'],
        ['Delighters','An unexpected useful feature can create a pleasant surprise.','A thoughtful extra service or a playful, useful interaction can exceed expectations.','Offers opportunities to add meaningful value.']
      ]],
    atomic: ['Atomic Design','Brad Frost’s approach to interface systems',
      'Atomic Design treats an interface as a system of related parts. Atoms, molecules, organisms, templates and pages work together rather than forming a rigid sequence.',
      [
        ['Atoms','Small interface elements that retain a clear, individual function.','Labels, inputs and buttons provide basic building blocks, supported by color and typography tokens.','Establishes the foundation of the system.'],
        ['Molecules','Simple combinations of elements that perform a focused task.','An input and button form a search control; a label and input form a field.','Creates reusable functional combinations.'],
        ['Organisms','Larger interface sections composed of smaller parts.','A navigation header, product card or footer combines related elements.','Defines major sections of the interface.'],
        ['Templates and pages','Templates describe structure; pages demonstrate it with actual content.','Populate a structural layout with realistic text, images and data.','Checks whether the system works with real content.']
      ]],
    iso9241: ['ISO 9241-210','Human-centered design for interactive systems',
      'ISO 9241-210 describes human-centered design activities and principles for interactive systems. Understand users and their context, then develop and evaluate solutions iteratively.',
      [
        ['Understand people and context','Base design decisions on a clear understanding of users, tasks and environments.','Before designing an in-car screen, consider driver attention, lighting and the operating context.','Helps the product fit real conditions of use.'],
        ['Iterate through evaluation','Understand the context, specify requirements, develop solutions and evaluate them.','Research, requirements, prototypes and usability testing inform successive improvements.','Uses evidence and feedback to refine the design.']
      ]],
    tesler: ['Tesler’s Law','Consider who carries the complexity',
      'Some complexity is intrinsic to a task. Design decisions determine how much of it is handled by the system and how much is left to the user.',
      [
        ['Let the system handle appropriate work','Automate details the system can infer reliably, while keeping the user in control.','Given an origin and destination, show available train services rather than asking the user to assemble a timetable.','Exchanges implementation effort for a simpler user task.']
      ]]
  };
  const categories = {
    interaction: ['交互与可用性','Interaction & usability'],
    psychology: ['心理学','Psychology'], visual: ['视觉感知','Visual perception'],
    business: ['商业策略','Product strategy'], system: ['系统思维','Systems thinking']
  };
  function item(source, language) {
    if (language !== 'en') return source;
    const translated = content[source.id];
    if (!translated) throw new Error('Missing theory translation: ' + source.id);
    return { ...source, title:translated[0], subtitle:translated[1], desc:translated[2],
      subItems:translated[3].map(([title, core, example, val]) => ({ title, core, case:example, val })) };
  }
  globalThis.TheoryLocale = Object.freeze({ content, categories, item });
})();

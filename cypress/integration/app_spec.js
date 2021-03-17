describe('Todo', function () {
  //let TODO_ITEM_ONE = 'buy some cheese'
  //let TODO_ITEM_TWO = 'feed the cat'
  //let TODO_ITEM_THREE = 'book a doctors appointment'
  
  let TODO_ITEM_ONE = 'stack sats'
  let TODO_ITEM_TWO = 'take custody of UTXOs'
  let TODO_ITEM_THREE = 'maximize sovereignty'
  let TODO_ITEM_WHITESPACE = '    ₿    '

  beforeEach(function () {
    cy.visit('/')
  })

  afterEach(() => {
    // In firefox, blur handlers will fire upon navigation if there is an activeElement.
    // This is needed to blur activeElement after each test to prevent state leakage.
    cy.window().then((win) => {
      win.document.activeElement.blur()
    })
  })

  context('When page is initially opened', function () {
    it('should focus on the todo input field', function () {
      cy.focused().should('have.class', 'new-todo')
    })
  })

  context('No Todos', function () {
    it('should hide #main and #footer', function () {
      cy.get('.todo-list li').should('not.exist')
      cy.get('.main').should('not.exist')
      cy.get('.footer').should('not.exist')
    })
  })

  context('New Todo', function () {
    it('should allow me to add todo items', function () {
      // TODO: create a test for adding a todo
	  
	  //Create a new to-do item and ensure it contains the proper text
	  cy.createTodo(TODO_ITEM_ONE).should('have.text', TODO_ITEM_ONE)
	  
	  //Check that this new entry is reflected in the item count
	  cy.get('.todo-count').contains('1 item left')
    })

    it('should clear text input field when an item is added', function () {
      cy.get('.new-todo')
      .type(TODO_ITEM_ONE)
      .type('{enter}')

      cy.get('.new-todo').should('have.text', '')
    })

    it('should append new items to the bottom of the list', function () {
      cy.createDefaultTodos().as('todos')

      cy.get('.todo-count').contains('3 items left')

      cy.get('@todos')
      .eq(0)
      .find('label')
      .should('contain', TODO_ITEM_ONE)

      cy.get('@todos')
      .eq(1)
      .find('label')
      .should('contain', TODO_ITEM_TWO)

      cy.get('@todos')
      .eq(2)
      .find('label')
      .should('contain', TODO_ITEM_THREE)
    })

    it('should trim text input', function () {
      // TODO: add a test for ensuring that whitespace is trimmed from the todo
      // input such that "  todo   " ends up being added as "todo".
	  
	  //Create the new list item and ensure the item text matches the trimmed version of the original input
	  cy.createTodo(TODO_ITEM_WHITESPACE)
	  .should('have.text', TODO_ITEM_WHITESPACE.trim())
    })

    it('should show #main and #footer when items added', function () {
      cy.createTodo(TODO_ITEM_ONE)
      cy.get('.main').should('be.visible')
      cy.get('.footer').should('be.visible')
    })
  })

  context('Mark all as completed', function () {
    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should allow me to mark all items as completed', function () {
      cy.get('.toggle-all').check()

      cy.get('@todos')
      .eq(0)
      .should('have.class', 'completed')

      cy.get('@todos')
      .eq(1)
      .should('have.class', 'completed')

      cy.get('@todos')
      .eq(2)
      .should('have.class', 'completed')
    })

    it('should allow me to clear the complete state of all items', function () {
      cy.get('.toggle-all')
      .check()
      .uncheck()

      cy.get('@todos')
      .eq(0)
      .should('not.have.class', 'completed')

      cy.get('@todos')
      .eq(1)
      .should('not.have.class', 'completed')

      cy.get('@todos')
      .eq(2)
      .should('not.have.class', 'completed')
    })

    it('complete all checkbox should update state when items are completed / cleared', function () {
      cy.get('.toggle-all')
      .as('toggleAll')
      .check()
      .should('be.checked')

      cy.get('.todo-list li')
      .eq(0)
      .as('firstTodo')
      .find('.toggle')
      .uncheck()

      cy.get('@toggleAll').should('not.be.checked')

      cy.get('@firstTodo')
      .find('.toggle')
      .check()

      cy.get('@toggleAll').should('be.checked')
    })
  })

  context('Item', function () {
    //Create a couple default list items to mess with at the beginning of each test in this set
	beforeEach(function () {
	  cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
      cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
    })

    it('should allow me to mark items as complete', function () {
      // TODO: add a test to mark an item as completed

	  //Find the first list item and mark it as complete
      cy.get('@firstTodo')
      .find('.toggle')
      .check()

	  //Check that first item is in a completed state (and that the second item hasn't changed)
      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })

    it('should allow me to un-mark items as complete', function () {
      cy.get('@firstTodo')
      .find('.toggle')
      .check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo')
      .find('.toggle')
      .uncheck()

      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })

    it('should allow me to edit an item', function () {
      // TODO: add a test ensure that you can edit an item
	  
	  //Double click the first item in the list to start editing
	  cy.get('@firstTodo').find('label')
	  .dblclick()
	  
	  //Clear out the original text from the focused element, replace message, and press enter to submit changes
	  cy.focused().clear()
      .type('this entry was edited{enter}')
	  
	  //Ensure the list item now contains the new text
	  cy.get('@firstTodo').should('have.text', 'this entry was edited')
    })
  })

  context('Editing', function () {
    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should hide other controls when editing', function () {
      cy.get('@todos')
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.toggle')
      .should('not.be.visible')

      cy.get('@secondTodo')
      .find('label')
      .should('not.be.visible')
    })

    it('should save edits on blur', function () {
      cy.get('@todos')
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('buy some sausages')
      // we can just send the blur event directly
      // to the input instead of having to click
      // on another button on the page. though you
      // could do that its just more mental work
      .blur()

      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos')
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should trim entered text', function () {
      cy.get('@todos')
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('    buy some sausages    ')
      .type('{enter}')

      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      cy.get('@todos')
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should remove the item if an empty text string was entered', function () {
      cy.get('@todos')
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('{enter}')

      cy.get('@todos').should('have.length', 2)
    })

    it('should cancel edits on escape', function () {
      cy.get('@todos')
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('foo{esc}')

      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@todos')
      .eq(1)
      .should('contain', TODO_ITEM_TWO)

      cy.get('@todos')
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })
  })

  context('Counter', function () {
    it('should display the current number of todo items', function () {
      cy.createTodo(TODO_ITEM_ONE)
      cy.get('.todo-count').contains('1 item left')
      cy.createTodo(TODO_ITEM_TWO)
      cy.get('.todo-count').contains('2 items left')
    })
  })

  context('Clear completed button', function () {
    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should display the correct text', function () {
      cy.get('@todos')
      .eq(0)
      .find('.toggle')
      .check()

      cy.get('.clear-completed').contains('Clear completed')
    })

    it('should remove completed items when clicked', function () {
      cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

      cy.get('.clear-completed').click()
      cy.get('@todos').should('have.length', 2)
      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@todos')
      .eq(1)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should be hidden when there are no items that are completed', function () {
      cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

      cy.get('.clear-completed')
      .should('be.visible')
      .click()

      cy.get('.clear-completed').should('not.exist')
    })
  })

  context('Persistence', function () {
    it('should persist its data', function () {
      function testState () {
        cy.get('@firstTodo')
        .should('contain', TODO_ITEM_ONE)
        .and('have.class', 'completed')

        cy.get('@secondTodo')
        .should('contain', TODO_ITEM_TWO)
        .and('not.have.class', 'completed')
      }

      cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
      cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
      cy.get('@firstTodo')
      .find('.toggle')
      .check()
      .then(testState)

      .reload()
      .then(testState)
    })
  })

  context('Routing', function () {
    beforeEach(function () {
      cy.createDefaultTodos().as('todos')
    })

    it('should allow me to display active items', function () {
      cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

      cy.get('.filters')
      .contains('Active')
      .click()

      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@todos')
      .eq(1)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should respect the back button', function () {
      cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

      cy.get('.filters')
      .contains('Active')
      .click()

      cy.get('.filters')
      .contains('Completed')
      .click()

      cy.get('@todos').should('have.length', 1)
      cy.go('back')
      cy.get('@todos').should('have.length', 2)
      cy.go('back')
      cy.get('@todos').should('have.length', 3)
    })

    it('should allow me to display completed items', function () {
      // TODO: add a test to verify the completed items display
	  
	  //Mark the second list item as complete
	  cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

	  //Click over to the Completed filter
      cy.get('.filters')
      .contains('Completed')
      .click()

      //Check that the first entry under the Completed filter is the correct item (TODO_ITEM_TWO)
      cy.get('@todos')
      .eq(0)
      .should('contain', TODO_ITEM_TWO)
	  
	  //Make sure only the one completed item is shown in the list
	  cy.get('@todos').should('have.length', 1)
    })

    it('should allow me to display all items', function () {
      cy.get('@todos')
      .eq(1)
      .find('.toggle')
      .check()

      cy.get('.filters')
      .contains('Active')
      .click()

      cy.get('.filters')
      .contains('Completed')
      .click()

      cy.get('.filters')
      .contains('All')
      .click()

      cy.get('@todos').should('have.length', 3)
    })

    it('should highlight the currently applied filter', function () {
      // using a within here which will automatically scope
      // nested 'cy' queries to our parent element <ul.filters>
      cy.get('.filters').within(function () {
        cy.contains('All').should('have.class', 'selected')
        cy.contains('Active')
        .click()
        .should('have.class', 'selected')

        cy.contains('Completed')
        .click()
        .should('have.class', 'selected')
      })
    })
  })

  context('Contrast', () => {
    it('has good contrast when empty', () => {
      cy.addAxeCode()
      cy.checkA11y(null, {
        runOnly: ['cat.color'],
      })
    })

    it('has good contrast with several todos', () => {
      cy.addAxeCode()
      cy.get('.new-todo')
      .type('learn testing{enter}')
      .type('be cool{enter}')

      cy.get('.todo-list li').should('have.length', 2)
      cy.checkA11y(null, {
        runOnly: ['cat.color'],
      })

      // and after marking an item completed
      cy.get('.todo-list li')
      .first()
      .find('.toggle')
      .check()

      cy.get('.todo-list li')
      .first()
      .should('have.class', 'completed')

      cy.checkA11y(null, {
        runOnly: ['cat.color'],
      })
    })
  })
})

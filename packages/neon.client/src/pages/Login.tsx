import styled from 'styled-components'

import { Button, Label, Textbox } from '~/components/input'
import { Text } from '~/components/typography'

const Container = styled.div`
  display: block;
`

const Password = styled(Textbox).attrs({
  type: 'password',
})``

const Form = styled.form`
  display: flex;
`

export default function Auth(): JSX.Element {
  return (
    <Container>
      <Text>You need to login, bud.</Text>
      <Form>
        <Label>
          <Textbox placeholder="Username" />
        </Label>
        <Label>
          <Password placeholder="Password" />
        </Label>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  )
}

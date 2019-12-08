Компонент-кнопка для возврата назад. Совместима с `IOS` и с `Android`
Представляет из себя обертку над компонентом `HeaderButton`

```jsx
<PanelHeader left={<BackButton/>}>
  Header
</PanelHeader>
```

Если клик должен обрабатывать какое-то другое действие, отличное от перехода назад, то надо использовать так

```jsx
<PanelHeader left={<BackButton onClick={() => console.log('Hello!')}}/>}>
  Header
</PanelHeader>
```
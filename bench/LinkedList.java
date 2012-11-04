public class LinkedList<E> {
  //--- node type
  private class Node {
    Node(E el) { data = el; }
    public String toString() { return data.toString(); }
    public E data;
    public Node next;
  }

  //--- members:
  private Node head;

  //--- constructor
  public LinkedList() {
    head = null;
  }

  public E first() {
    if(empty())
      return null;
    return head.data;
  }

  public LinkedList<E> rest() {
    //assert(!empty());

    LinkedList<E> result = new LinkedList<E>();
    result.head = head.next;
    return result;
  }

  public boolean empty() {
    return head == null;
  }

  public int length() {
    Node n = head;
    int count = 0;
    while(n != null) {
      n = n.next;
      count++;
    }
    return count;
  }

  public void push(E element) {
    Node oldHead = head;
    head = new Node(element);
    head.next = oldHead;
  }

  public E pop() {
    //assert(!empty());
    
    E val = head.data;
    head = head.next;
    return val;
  }

  public void append(E element) {
    // put first
    if(empty()) {
      head = new Node(element);
      return;
    }

    // put rest
    Node n = head;
    while(n.next != null) {
      n = n.next;
    }

    n.next = new Node(element);
  }

  public LinkedList<E> reverse() {
    LinkedList<E> result = new LinkedList<E>();
    
    Node n = head;
    while(n != null) {
      result.push(n.data);
      n = n.next;
    }
    return result;
  }

  public String toString() {
    String result = "(";

    Node n = head;
    while(n != null) {
      result += n;
      n = n.next;
      if(n != null) {
        result += " ";
      }
    }
    return result + ")";
  }
}

